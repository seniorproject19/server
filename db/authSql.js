var authSql = {
  insert: 'INSERT INTO users(username, pwd, email, registration_date, birthday, is_owner, vehicle_info, balance) VALUES(?, ?, ?, ?, ?, ?, ?, 0)',
  queryAll: 'SELECT * FROM users',
  getUserById: 'SELECT * FROM users WHERE uid = ?',
  getUserByUsername: 'SELECT * FROM users WHERE username = ?',
  getUserByEmail: 'SELECT * FROM users WHERE email = ?'
};

module.exports = authSql;