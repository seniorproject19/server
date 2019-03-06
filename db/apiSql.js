var apiSql = {
  newPost: 'INSERT INTO posts(uid, date_posted, title, description, longitude, latitude, address_1, address_2, city, state, zipcode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  getPost: 'SELECT * FROM posts WHERE pid = ?',
  newAvailability: 'INSERT INTO availability(weekday, start_time, end_time, hourly_rate, pid) VALUES(?, ?, ?, ?)',
  removeAvailabilityForPost: 'DELETE FROM availability WHERE pid = ?'
};

module.exports = apiSql;