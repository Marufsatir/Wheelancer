
CREATE TABLE IF NOT EXISTS User (
  user_id int NOT NULL AUTO_INCREMENT,
  user_name varchar(32) NOT NULL UNIQUE,
  email varchar(32) NOT NULL UNIQUE,
  name varchar(32) NOT NULL,
  biography varchar(255) DEFAULT NULL,
  password varchar(32) NOT NULL,
  balance int DEFAULT 0,
  PRIMARY KEY (user_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS auth (
  date DATETIME NOT NULL,
  token varchar(32) NOT NULL,
  user_id int NOT NULL,
  FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  PRIMARY KEY (token)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS Customer(
  user_id INT PRIMARY KEY,
  FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Admin(
  user_id INT PRIMARY KEY,
  FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Courier(
  user_id INT PRIMARY KEY,
  FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  is_verified BIT DEFAULT 0,
  verifier_id int DEFAULT NULL,
  FOREIGN KEY(verifier_id) REFERENCES User(user_id) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CREATE TABLE IF NOT EXISTS friend_of(
--   user_id INT,
--   FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE,
--   friend_id INT,
--   FOREIGN KEY(friend_id) REFERENCES User(user_id) ON DELETE CASCADE,
--   accepted BIT DEFAULT 0,
--   CONSTRAINT PK_Person PRIMARY KEY (user_id,friend_id)
-- )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Node(
  nid int PRIMARY KEY AUTO_INCREMENT,
  lat FLOAT( 10, 6 ) NOT NULL,
  lng FLOAT( 10, 6 ) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS Transport(
  tid int PRIMARY KEY AUTO_INCREMENT,
  customer_id int NOT NULL,
  courier_id int,
  cargo_size varchar(64) NOT NULL,
  cargo_weight int NOT NULL,
  creation_date DATETIME DEFAULT CURRENT_TIMESTAMP(),
  departure_node_id int,
  arrival_node_id int,
  FOREIGN KEY(customer_id) REFERENCES Customer(user_id) ON DELETE CASCADE,
  FOREIGN KEY(courier_id) REFERENCES Courier(user_id) ON DELETE CASCADE,
  FOREIGN KEY(departure_node_id) REFERENCES Node(nid) ON DELETE CASCADE,
  FOREIGN KEY(arrival_node_id) REFERENCES Node(nid) ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
