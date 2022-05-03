CREATE TABLE IF NOT EXISTS User (
	user_id INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	name VARCHAR(20) NOT NULL,
	surname VARCHAR(20) NOT NULL,
	birthday DATE NOT NULL,
	id_num VARCHAR(11) UNIQUE NOT NULL,
	balance INT(8) DEFAULT 0 NOT NULL,
	email VARCHAR(64) NOT NULL UNIQUE,
	password VARCHAR(64) NOT NULL,
	email_verified TINYINT DEFAULT 0 NOT NULL,
	registration_date DATETIME DEFAULT CURRENT_TIMESTAMP() NOT NULL,
	verify_try INT(10) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Admin (
	user_id INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Courier (
	user_id INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	verifier_id INT(10) DEFAULT NULL,
	avg_rating DECIMAL(3,2) DEFAULT NULL,
	is_verified TINYINT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE,
	FOREIGN KEY(verifier_id) REFERENCES Admin(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Customer (
	user_id INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Feedback (
	courier_id INT(10) NOT NULL,
	customer_id INT(10) NOT NULL,
	message VARCHAR(255),
	rate DECIMAL(3,2) NOT NULL,
	date DATETIME NOT NULL,
	PRIMARY KEY(courier_id, customer_id),
	FOREIGN KEY(courier_id) REFERENCES Courier(user_id) ON DELETE CASCADE,
	FOREIGN KEY(customer_id) REFERENCES Customer(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Badge (
	badid INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Courier_Badge (
	user_id INT(10) NOT NULL,
	badid INT(10) NOT NULL,
	PRIMARY KEY(user_id, badid),
	FOREIGN KEY(user_id) REFERENCES Courier(user_id) ON DELETE CASCADE,
	FOREIGN KEY(badid) REFERENCES Badge(badid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Document (
	documentID INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	user_id INT(10) NOT NULL,
	document BLOB NOT NULL,
	type INT(1) NOT NULL,
	is_verified TINYINT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES Courier(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Vehicle (
	vehicle_id INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	user_id INT(10) NOT NULL,
	model VARCHAR(16) NOT NULL,
	brand VARCHAR(16) NOT NULL,
	max_length DECIMAL(6,3) NOT NULL,
	max_width DECIMAL(6,3) NOT NULL,
	max_height DECIMAL(6,3) NOT NULL,
	max_weight DECIMAL(6,3) NOT NULL,
	horsepower INT(10) NOT NULL,
	registration_plate VARCHAR(16) NOT NULL UNIQUE,
	FOREIGN KEY(user_id) REFERENCES Courier(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Transportation (
	transport_id INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	courier_id INT(10) NOT NULL,
	vehicle_id INT(10) NOT NULL,
	courier_pos_long DECIMAL(10,6) NOT NULL,
	courier_pos_lat DECIMAL(10,6) NOT NULL,
	last_update_date DECIMAL(10,6) NOT NULL,
	remaining_length DECIMAL(6,3) NOT NULL,
	remaining_width DECIMAL(6,3) NOT NULL,
	remaining_height DECIMAL(6,3) NOT NULL,
	remaining_weight DECIMAL(6,3) NOT NULL,
	departure_date DATE,
	arrival_date DATE,
	status VARCHAR(16) NOT NULL,
	FOREIGN KEY(courier_id) REFERENCES Courier(user_id) ON DELETE CASCADE,
	FOREIGN KEY(vehicle_id) REFERENCES Vehicle(vehicle_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Package (
	pid INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	cid INT(10) NOT NULL,
	transport_id int(10) DEFAULT NULL,
	length DECIMAL(6,3) NOT NULL,
	width DECIMAL(6,3) NOT NULL,
	height DECIMAL(6,3) NOT NULL,
	weight DECIMAL(6,3) NOT NULL,
	type SET('Explosives','Gases','Flammable','Oxidizing','Toxic and Infectious','Radioactive Material','Corrosives') NOT NULL,
	s_long DECIMAL(10,6) NOT NULL,
	s_lat DECIMAL(10,6) NOT NULL,
	d_long DECIMAL(10,6) NOT NULL,
	d_lat DECIMAL(10,6) NOT NULL,
	status `status` ENUM('CREATED','NEGOTIATED','REJECTED','PICKEDUP','DELIVERED','CONFIRMED') NOT NULL DEFAULT 'CREATED',
	receiver_email VARCHAR(64) NOT NULL,
	estimated_delivery_date DATE,
	chat_channel_id int(10) DEFAULT NULL,
	s_city VARCHAR(32) NOT NULL,
	d_city VARCHAR(32) NOT NULL,
	FOREIGN KEY(cid) REFERENCES Customer(user_id) ON DELETE CASCADE,
	FOREIGN KEY(transport_id) REFERENCES Transportation(transport_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Package_Proofs (
	pid INT(10) PRIMARY KEY NOT NULL,
	type VARCHAR(12) NOT NULL,
	image BLOB NOT NULL,
	date DATE NOT NULL,
	FOREIGN KEY(pid) REFERENCES Package(pid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Offer (
	pid INT(10) NOT NULL,
	courier_id INT(10) NOT NULL,
	price INT(10),
	PRIMARY KEY(pid, courier_id),
	FOREIGN KEY(pid) REFERENCES Package(pid) ON DELETE CASCADE,
	FOREIGN KEY(courier_id) REFERENCES Courier(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Verification (
	vid int(10) PRIMARY KEY NOT NULL AUTO_INCREMENT
	user_id int(10) NOT NULL,
	expire_date datetime NOT NULL,
	code int(4) NOT NULL,
	FOREIGN KEY(user_id) references User(user_id) ON DELETE CASCADE
);