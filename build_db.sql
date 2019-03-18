CREATE TABLE users(
   uid BIGINT NOT NULL AUTO_INCREMENT,
   username VARCHAR(128) NOT NULL,
   pwd VARCHAR(255) NOT NULL,
   email VARCHAR(128) NOT NULL,
   registration_date DATE,
   birthday DATE,
   is_owner BOOLEAN,
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

CREATE TABLE vehicles(
   vid BIGINT NOT NULL,
   state CHAR(2),
   plate_number VARCHAR(8),
   PRIMARY KEY (vid)
);

CREATE TABLE records(
   rid BIGINT NOT NULL AUTO_INCREMENT,
   uid BIGINT NOT NULL,
   vid BIGINT NOT NULL,
   pid BIGINT NOT NULL,
   start_time INT NOT NULL,
   end_time INT NOT NULL,
   PRIMARY KEY (rid),
   FOREIGN KEY (uid) REFERENCES users(uid),
   FOREIGN KEY (vid) REFERENCES vehicles(vid)
);
