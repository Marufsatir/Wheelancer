-- Register User
"INSERT into User (name,surname,birthday,id_num,email,password) values(?,?,?,?,?,?)", [name,surname,birthday,idNum,email,password]

-- Take registered user_id
"SELECT user_id FROM User WHERE id_num = ?", [idNum]

-- Login User
"SELECT * FROM User WHERE email = ? and password = ?", [email,password]

-- Register Courier
"INSERT INTO Courier(user_id) values(?)", [userID]

-- Register Customer
"INSERT INTO Customer VALUES(?)", [userID]

-- Update email_verified after register
"UPDATE User SET email_verified = 1 WHERE user_id = ?", [userID]

-- Create new verification code
"INSERT INTO Verification VALUES(?,?,?)", [userID,expireDate,code]

-- List recent codes for a single user
"SELECT * FROM Verification WHERE user_id = ? ORDER BY expire_date DESC", [userID]

-- Show all packages of a customer
"SELECT * FROM Package WHERE cid = ?", [userID]

-- Show a single package of a customer
"SELECT * FROM Package WHERE pid = ? AND cid = ?", [pid,cid]

-- Add package
"INSERT INTO Package(cid,transport_id,length,width,height,weight,type,s_long,s_lat,d_long,d_lat,receiver_email,estimated_delivery_date,chat_channel_id,s_city,d_city) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)" [cid,transportId,length,width,height,weight,type,s_long,s_lat,d_long,d_lat,receiverEmail,estimatedDeliveryDate,chatChannelId,s_city,d_city]

-- Delete package
"DELETE FROM Package WHERE pid = ?", [pid]

-- Write Feedback
"INSERT INTO Feedback VALUES(?,?,?,?)", [courierID,customerID,message,rate]

-- Assign Badge to Courier
"INSERT INTO Courier_Badge VALUES(?,?)", [userID,badgeID]

-- Assign new Vehicle to Courier
"INSERT INTO Vehicle(user_id,model,brand,max_length,max_width,max_height,max_weight,horsepower,registration_plate) VALUES(?,?,?,?,?,?,?,?,?)", [userID,model,brand,max_length,max_width,max_height,max_weight,horsepower,registration_plate]

-- List Vehicles of a User
"SELECT * FROM Vehicle WHERE user_id = ?", [userID]

-- Add Document
"INSERT INTO Document(user_id,document) VALUES(?,?)", [userID,document]

-- View a single proof
"SELECT * FROM Package_Proofs WHERE proof_id = ?", [proofID]

-- List proofs (?)
"SELECT pp.proof_id, pp.type, pp.image, pp.date FROM Package_Proofs pp LEFT JOIN Package p ON (p.pid = pp.pid) LEFT JOIN Transportation t ON (p.transport_id = t.transport_id) WHERE p.pid = ? AND (p.cid = ? OR t.courier_id = ?)", [pid,cid,courierID]

-- Add Proof
"INSERT INTO Package_Proofs(pid,type,image) VALUES(?,?,?)", [pid,type,image]

-- Tek belge bakma
"SELECT * FROM Document d LEFT JOIN Package p ON (p.pid = pp.pid) LEFT JOIN Transportation t ON (p.transport_id = t.transport_id) WHERE p.cid = ? OR t.courier_id = ?", [cid]

"SELECT * FROM Document WHERE user_id = ?", [userID]