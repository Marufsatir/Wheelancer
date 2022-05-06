-- For listing user types 
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

CREATE EVENT `Verification Remover` 
ON SCHEDULE EVERY 1 MINUTE ON COMPLETION NOT PRESERVE ENABLE DO DELETE 
FROM Verification v WHERE CURRENT_TIMESTAMP() > v.expire_date