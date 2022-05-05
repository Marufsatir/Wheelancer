-- <USER>
INSERT INTO User (user_id, name, surname, birthday, id_num, email, password) VALUES
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
INSERT INTO Admin (user_id) VALUES (1);

-- <COURIER>
INSERT INTO Courier(user_id) VALUES (2),(3),(70);

-- <CUSTOMER>
INSERT INTO Customer VALUES (4),(5),(6),(7),(8),(9),(10),(69);

-- <DOCUMENT>
INSERT INTO Document(user_id,document) VALUES
(2,'asdfgsef'),
(3,'dtghdfku'),
(70,'c2c14ad5-5700-4c5a-82df-863d1eed3c11');

-- <VEHICLE>
INSERT INTO Vehicle(user_id,model,brand,max_length,max_width,max_height,max_weight,horsepower,registration_plate) VALUES
(2,'G63','Mercedes-Benz',140,110,90,50,250,'33ABC59','Car'),
(3,'Civic','Honda',100,80,80,30,100,'06F89732','Car'),
(70,'Corsa','Opel',90,70,70,25,100,'34AC1459','Car'),
(70,'Golf','Volkswagen',120,90,80,40,120,'06MS8967','Car'),
(70,'Golf','Volkswagen',120,90,80,40,120,'06MS1967','Truck'),
(70, 'main', 'kavazaki', 100, 150, 200, 200, 130, '61srht69', 'Car'),
(70, 'gold', 'volkswagen', 101, 300, 999.999, 999.999, 100, '64umt06', 'Car'),
(70, 'truck', 'euro', 50, 10, 10, 10, 180, '61ss61', 'Car');

-- <PACKAGE>
INSERT INTO Package(cid, transport_id, length, width, height, weight, type, s_long, s_lat, d_long, d_lat, status, receiver_fullname, receiver_email, estimated_delivery_date, chat_channel_id, s_city, d_city)VALUES
(69, NULL, 11.000, 12.000, 123.000, 234.000, 'Explosives,Gases,Flammable', 39.716763, 41.002697, 32.746486, 39.864403, 'PICKEDUP', 'Erdal Kömürcü', 'mm@gmail.com', NULL, NULL, 'kurucesme mahallesi, gülcicek so', 'ankara'),
(4, NULL, 10.000, 10.000, 10.000, 10.000, NULL, 39.880328, 32.760120, 39.924322, 32.828191, 'CREATED', 'asd', 'asdfhsfg', NULL, NULL, 'Ankara', 'sdfg'),
(5, NULL, 10.000, 10.000, 10.000, 10.000, NULL, 39.880262, 32.757934, 39.924322, 32.828191, 'CREATED', 'asd', 'asdfhsfg', NULL, NULL, 'Ankara', 'sdfg'),
(6, NULL, 10.000, 10.000, 10.000, 10.000, NULL, 39.882854, 32.757088, 39.924322, 32.828191, 'CREATED', 'asd', 'asdfhsfg', NULL, NULL, 'Ankara', 'sdfg'),
(7, NULL, 10.000, 10.000, 10.000, 10.000, NULL, 39.881817, 32.753892, 39.924322, 32.828191, 'CREATED', 'asd', 'asdfhsfg', NULL, NULL, 'Ankara', 'sdfg'),
(8, NULL, 10.000, 10.000, 10.000, 10.000, NULL, 39.884853, 32.757162, 39.924322, 32.828191, 'CREATED', 'asd', 'asdfhsfg', NULL, NULL, 'Ankara', 'sdfg'),
(9, NULL, 10.000, 10.000, 10.000, 10.000, NULL, 39.884866, 32.759860, 39.924322, 32.828191, 'CREATED', 'asd', 'asdfhsfg', NULL, NULL, 'Ankara', 'sdfg'),
(69, 2, 1.000, 1.000, 1.000, 1.000, 'Explosives,Flammable', 29.405883, 38.674229, 32.854060, 39.920802, 'CREATED', 'Berk StarEge Eroglu', 'onatkutlar@gmail.com', NULL, NULL, 'Usak', 'Ankara'),
(69, 2, 1.000, 1.000, 1.000, 1.000, 'Explosives', 29.405883, 38.674229, 32.859742, 39.933364, 'CONFIRMED', 'Ben', 'ben@gmail.com', NULL, NULL, 'Usak', 'Ankara');

-- <PROOFS>
INSERT INTO Package_Proofs(pid, type, image, date)VALUES
(3, 'INITIAL', '37f54f1c-56ae-4471-941d-6948e1a29be1', '2022-05-04 13:44:21'),
(14, 'INITIAL', '8dd21127-121d-4fb9-be1f-ac5656824137', '2022-05-04 16:38:16'),
(16, 'INITIAL', '20fc26d9-931a-43dc-ac78-2d387327d98f', '2022-05-04 16:41:23');

-- <TRANSPORTATION>
INSERT INTO Transportation
(courier_id, vehicle_id, courier_pos_long, courier_pos_lat, last_update_date, remaining_weight, remaining_volume, departure_date, arrival_date, status) VALUES
(70, 3, 126.574000, 354.153500, 5374.000000, 45.000, 0.000, '2022-02-01', '2022-02-03', 'CREATED'),
(2, 1, 39.880328, 32.760120, 2022.000000, 25.000, 0.000, '2022-02-01', '2022-02-03', 'CREATED');

-- <OFFER>
INSERT INTO Offer(pid, courier_id, price) VALUES
(7, 2, 100),
(7, 3, 90),
(8, 70, 200),
(9, 70, 150);

