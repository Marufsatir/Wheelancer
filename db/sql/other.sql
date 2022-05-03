/*>>>>>>>>>>Procedures*/

/* */
DROP PROCEDURE IF EXISTS PostComments_procedure;
CREATE PROCEDURE `PostComments_procedure`(IN `postId` INT) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER 
SELECT u.user_name, u.name, c.text, DATE_FORMAT(c.date, "%e %M %Y") AS date FROM (SELECT * FROM post_comment WHERE pid = postId) AS pc JOIN Comment c 
USING (cid) JOIN User u 
USING (user_id) ORDER BY c.date

/* For listing challenge list with availability, progress and join status */
DROP PROCEDURE IF EXISTS challengelist_procedure;
CREATE PROCEDURE `challengelist_procedure`(IN `userID` INT) NOT DETERMINISTIC NO SQL SQL SECURITY DEFINER 
SELECT c.challenge_name, c.chal_id, bl.name AS book_listname, bl.book_count, (EXISTS (SELECT * from joins_challenge jc2 where jc2.user_id = userID AND jc2.chal_id = c.chal_id)) AS isJoined,
(SELECT ROUND((jc.book_read / bl.book_count) * 100 ) FROM joins_challenge jc WHERE user_id = userID AND chal_id = c.chal_id) AS percent
FROM Challenge c LEFT JOIN Book_list bl USING(bl_id) ORDER BY percent DESC 

/*For Calling<<<
CALL PostComments_procedure(19)*/

/*>>>>>>>>>>>Event*/

SET GLOBAL event_scheduler="ON"

CREATE EVENT `Auth Remover` ON SCHEDULE EVERY 1 MINUTE ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM auth WHERE CURRENT_TIMESTAMP() > auth.date

CREATE EVENT `Challenge Remover` ON SCHEDULE EVERY 1 MINUTE ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM Challenge WHERE CURRENT_TIMESTAMP() > Challenge.due_date
/*>>>>>>>>>>>>>>>Views*/

/* For listing comments to progress */
/* 
CREATE VIEW comment_progress_view AS                                                                       
SELECT u.user_id, pc.cid, pc.pro_id, c.date, u.user_name, u.name, c.text                                   
FROM Progress p JOIN progress_comment pc USING(pro_id) JOIN Comment c USING(cid) JOIN User u USING(user_id) */

/* For listing books with progress with username and dates */

CREATE VIEW book_progress_rating_user_view AS
SELECT ROUND((p.page_number/ b.pages) * 100, 0) AS progress , mp.book_id, mp.user_id, b.title, b.description, b.pages AS pages, p.page_number AS page_read, DATE_FORMAT(p.date, "%e %M %Y") AS date, p.pro_id, u.user_name, u.name, r.rating, b.year, b.genre, r.author_name
FROM Progress p JOIN mark_progress mp USING(pro_id) JOIN Book b USING(book_id) JOIN User u USING(user_id) JOIN  book_series_rating_view r USING (book_id) ORDER BY Progress DESC
/*For Listing Books with Progress */



/* CREATE VIEW book_progress_view AS
SELECT ROUND((p.page_number/ b.pages) * 100, 0) AS progress , mp.book_id, mp.user_id, b.title, b.description, b.pages AS total_pages, p.page_number AS page_read, p.pro_id
FROM Progress p JOIN mark_progress mp USING(pro_id) JOIN Book b USING(book_id) ORDER BY Progress DESC
 */


/* For Listing Books with series and rating*/

CREATE VIEW book_series_rating_view AS
SELECT b.book_id, b.title, b.description, b.genre, u.name AS author_name, s.name AS series_name , b.year, b.img_url, b.pages, (SELECT AVG(r.rating) FROM review r WHERE b.book_id = r.book_id) AS rating
FROM Book b LEFT JOIN series_of so USING(book_id) LEFT JOIN Series s USING(ser_id) LEFT JOIN publishes p USING(book_id) LEFT JOIN User u ON u.user_id = p.author_id ORDER BY title

/*For Listing Book and their publishers*/

CREATE VIEW book_publishes_view AS
SELECT *
FROM Book b JOIN publishes p USING(book_id)

/*For listing top 4 user comments*/
CREATE VIEW top_postcomment_view AS 
SELECT user_id, pid, title, text, DATE_FORMAT(date, "%e %M %Y") AS date, like_count, (SELECT COUNT(*) FROM post_comment c WHERE c.pid = p.pid ) AS comment_count
FROM Post p
ORDER BY user_id,like_count DESC
/*For listing incoming friend requests*/

CREATE VIEW incoming_request_view AS 
SELECT f.user_id AS sender_id, f.friend_id AS receiver_id, u.user_name, u.name, f.accepted FROM friend_of f JOIN User u ON f.user_id = u.user_id WHERE f.accepted = 0 ORDER BY u.name


/*For listing outgoing friend requests*/

CREATE VIEW outgoing_request_view AS 
SELECT f.user_id AS sender_id, f.friend_id AS receiver_id, u.user_name, u.name, f.accepted FROM friend_of f JOIN User u ON f.friend_id = u.user_id WHERE f.accepted = 0 ORDER BY u.name


/*For listing posts after selecting a thread */
CREATE VIEW Post_Preview AS
SELECT p.tid, p.pid, u.user_name, p.title, p.text, p.like_count, p.date FROM Post p JOIN User u USING (user_id) ORDER BY p.date DESC;

/*For listing user types */
CREATE VIEW UserType_View AS 
SELECT user_id, SUM(TYPE) AS type
FROM(
(SELECT user_id, 1 AS type FROM Courier)
UNION
(SELECT user_id, 2 FROM Admin)
UNION
(SELECT user_id, 0 FROM Customer)
) AS TEMP
GROUP BY user_id;

/*For listing potential friends before adding friend.*/
CREATE VIEW nonFriend_view as
SELECT u2.user_id, u2.user_name, u2.name, u2.biography, u2.email, u1.user_id AS check_user FROM User u1, User u2 WHERE NOT EXISTS 
(SELECT 1 FROM friend_of f WHERE f.user_id = u1.user_id AND f.accepted = 1 AND f.friend_id = u2.user_id) AND NOT EXISTS 
(SELECT 1 FROM friend_of f WHERE f.user_id = u2.user_id AND f.accepted = 1 AND f.friend_id = u1.user_id) AND u1.user_id <> u2.user_id
ORDER BY u2.name


/*>>>>>>>>>>>>>>>>>>>>>>>Triggers*/