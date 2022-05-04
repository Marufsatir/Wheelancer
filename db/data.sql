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
INSERT INTO Document(user_id,document) VALUES
(2,'asdfgsef'),
(3,'dtghdfku'),
(70,'sgbsdfhb');

-- <VEHICLE>
INSERT INTO Vehicle(user_id,model,brand,max_length,max_width,max_height,max_weight,horsepower,registration_plate) VALUES
(2,'G63','Mercedes-Benz',140,110,90,50,250,'33ABC59'),
(3,'Civic','Honda',100,80,80,30,100,'06F89732'),
(70,'Corsa','Opel',90,70,70,25,100,'34AC1459'),
(70,'Golf','Volkswagen',120,90,80,40,120,'06MS8967');

-- <PACKAGE>
INSERT INTO Package(cid,length,width,height,weight,type,s_long,s_lat,d_long,d_lat,receiver_fullname,receiver_email,s_city,d_city) VALUES
(69,12.5,14.2,5.1,12.4,'Flammable,Oxidizing',-99.79118,17.08936,-91.79118,19.08936,'Abuzer Kömürcü','berk4652@gmail.com','Angara','İstanbul'),
(69,12.5,14.2,5.1,12.4,'Flammable,Oxidizing',-99.79118,17.08936,-91.79118,19.08936,'Abuzer Kömürcü','berk4652@gmail.com','Angara','İstanbul'),
(69,11,12,123,234,'Explosives,Gases,Flammable',39.716763,41.002697,32.746486,39.864403,'Erdal Kömürcü','mm@gmail.com','kurucesme mahallesi, gülcicek so','ankara'),
(69,11,12,123,234,'Explosives,Gases,Flammable',39.716763,41.002697,32.746486,39.864403,'Erdal Kömürcü','mm@gmail.com','kurucesme mahallesi, gülcicek so','ankara');

-- <PROOFS>
INSERT INTO Package_Proofs(pid,type,image) VALUES
(1,'12321','123123'),
(1,'sdfsf','sdfsf'),
(2,'dfgsdg','sdfgdgf'),
(2,'asdasd','906fd724-ef4d-49a5-872f-f4c2294c8a01'),
(3,'INITIAL','37f54f1c-56ae-4471-941d-6948e1a29be1'),
(4,'INITIAL','0ae57722-4eb4-447a-8f37-0ed7c0841798');

-- <TRANSPORTATION>
INSERT INTO Transportation(courier_id,vehicle_id,courier_pos_long,courier_pos_lat,last_update_date,remaining_length,remaining_width,remaining_height,remaining_weight,departure_date,arrival_date,status) VALUES
(70,3,126.574,354.1535,5374,15,5,12,45,'2022-02-01','2022-02-03','Yolda');