var authSql = {
  insert: 'INSERT INTO users(username, pwd, email, registration_date, birthday) VALUES(?, ?, ?, ?, ?)',
  queryAll: 'SELECT * FROM users',
  getUserById: 'SELECT * FROM users WHERE uid = ?',
  getUserByUsername: 'SELECT * FROM users WHERE username = ?',
  getUserByEmail: 'SELECT * FROM users WHERE email = ?'
};

module.exports = authSql;