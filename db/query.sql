-- Register User
"INSERT into `User` (name,surname,birthday,id_num,email,password) values(?,?,?,?,?,?)", [name,surname,birthday,idNum,email,password]

-- Take registered user_id
"SELECT user_id FROM `User` WHERE id_num = ?", [idNum]

-- Login User
"SELECT * FROM `User` WHERE email = ? and password = ?", [email,password]

-- Register Courier
"INSERT INTO Courier(user_id) values(?)", [userID]

-- Register Customer
"INSERT INTO Customer VALUES(?)", [userID]

-- Update email_verified after register
"UPDATE `User` SET email_verified = 1 WHERE user_id = ?", [userID]

-- Create new verification code
"INSERT INTO Verification VALUES(?,?,?)", [userID,expireDate,code]

-- List recent codes for a single user
"SELECT * FROM Verification WHERE user_id = ? ORDER BY expire_date DESC", [userID]

-- Show all packages of a customer
"SELECT * FROM Package WHERE cid = ?", [userID]

-- Show a single package of a customer
"SELECT * FROM Package WHERE pid = ? AND cid = ?", [pid,cid]

-- Add package
"INSERT INTO Package(cid,transport_id,`length`,width,height,weight,`type`,s_long,s_lat,d_long,d_lat,receiver_email,estimated_delivery_date,chat_channel_id,s_city,d_city) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)" [cid,transportId,length,width,height,weight,type,s_long,s_lat,d_long,d_lat,receiverEmail,estimatedDeliveryDate,chatChannelId,s_city,d_city]

-- Delete package
"DELETE FROM Package WHERE pid = ?", [pid]

-- Write Feedback
"INSERT INTO Feedback VALUES(?,?,?,?,CURRENT_TIMESTAMP())", [courierID,customerID,message,rate]

-- Assign Badge to Courier
"INSERT INTO Courier_Badge VALUES(?,?)", [userID,badgeID]

-- Assign new Vehicle to Courier
"INSERT INTO Vehicle(user_id,model,brand,max_length,max_width,max_height,max_weight,horsepower,registration_plate) VALUES(?,?,?,?,?,?,?,?,?)", [userID,model,brand,max_length,max_width,max_height,max_weight,horsepower,registration_plate]