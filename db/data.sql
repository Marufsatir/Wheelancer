-- <USER>
INSERT INTO `user` (`user_id`, `name`, `surname`, `birthday`, `id_num`, `email`, `password`) VALUES
(1, 'Berk', 'Yildiz', '2022-05-01', '2147483647', 'uyuzgamer@wheelancer.com', 'berk123'),
(2, 'Jake', 'Peralta', '0000-00-00', '111111111', 'jake@a.com', 'amy123'),
(3, 'Amy', 'Santiago', '0000-00-00', '111111112', 'amy@99.com', 'binder123'),
(4, 'Rosa', 'Diaz', '0000-00-00', '111111113', 'diaz@99.com', 'motor123'),
(5, 'Raymond', 'Holt', '0000-00-00', '111115111', 'holt@nypd.com', 'pain123'),
(6, 'Adrian', 'Pimento', '0000-00-00', '111411111', 'pimento@cia.com', 'blood123'),
(7, 'Charles', 'Boyle', '0000-00-00', '111121111', 'boyle@99.com', 'shampoo'),
(8, 'Kevin', 'Holt', '0000-00-00', '111111611', 'holt@99.edu', 'book123'),
(9, 'Madeline', 'Wuntch', '0000-00-00', '171111111', 'wuntch@nypd.com', 'ray123'),
(10, 'John', 'Kelly', '0000-00-00', '111118111', 'kelly@nypd.com', 'nypd123'),
(69,'umit','civi','2022-05-01','12345678987','umitcivi3@gmail.com','616161'),
(70,'maruf','satir','2022-05-03','31246579812','m.maruf.99@hotmail.com','616161');

-- <ADMIN>
INSERT INTO `admin` (`user_id`) VALUES (1);

-- <COURIER>
INSERT INTO Courier(user_id) VALUES (2),(3),(70);

-- <CUSTOMER>
INSERT INTO Customer VALUES (4),(5),(6),(7),(8),(9),(10),(69);

-- <DOCUMENT>
