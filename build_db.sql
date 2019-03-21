CREATE TABLE users(
   uid BIGINT NOT NULL AUTO_INCREMENT,
   username VARCHAR(128) NOT NULL,
   pwd VARCHAR(255) NOT NULL,
   email VARCHAR(128) NOT NULL,
   registration_date DATE,
   birthday DATE,
   is_owner BOOLEAN,
   plate VARCHAR(11),
   balance DECIMAL(10, 2),
   vehicle_info VARCHAR(256),
   PRIMARY KEY (uid)
);

CREATE TABLE posts(
   pid BIGINT NOT NULL AUTO_INCREMENT,
   post_id VARCHAR(32) NOT NULL,
   uid BIGINT NOT NULL,
   date_posted DATETIME,
   title VARCHAR(1024),
   description VARCHAR(8192),
   longitude DECIMAL(9, 6),
   latitude DECIMAL(9, 6),
   address_1 VARCHAR(1024),
   address_2 VARCHAR(512),
   city VARCHAR(20),
   state CHAR(2),
   zipcode INT,
   removed BOOLEAN,
   PRIMARY KEY (pid),
   FOREIGN KEY (uid) REFERENCES users(uid)
);

CREATE TABLE availability(
   week_day CHAR(3),
   start_time DECIMAL(3, 1) NOT NULL,
   end_time DECIMAL(3, 1) NOT NULL,
   pid BIGINT NOT NULL,
   hourly_rate DECIMAL(4, 2) NOT NULL,
   FOREIGN KEY (pid) REFERENCES posts(pid)
);

CREATE TABLE records(
   rid BIGINT NOT NULL AUTO_INCREMENT,
   uid BIGINT NOT NULL,
   owner_uid BIGINT NOT NULL,
   pid BIGINT NOT NULL,
   start_date DATE,
   start_time DECIMAL(3, 1) NOT NULL,
   end_time DECIMAL(3, 1) NOT NULL,
   total_charges DECIMAL(6, 2),
   address VARCHAR(1024),
   plate VARCHAR(11),
   title VARCHAR(1024),
   description VARCHAR(8192),
   longitude DECIMAL(9, 6),
   latitude DECIMAL(9, 6),
   PRIMARY KEY (rid),
   FOREIGN KEY (uid) REFERENCES users(uid),
   FOREIGN KEY (owner_uid) REFERENCES users(uid),
   FOREIGN KEY (pid) REFERENCES posts(pid)
);
