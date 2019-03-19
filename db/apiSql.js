var apiSql = {
  newPost: 'INSERT INTO posts(post_id, uid, date_posted, title, description, longitude, latitude, address_1, address_2, city, state, zipcode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  getPost: 'SELECT * FROM posts WHERE pid = ?',
  getPostByPostId: 'SELECT * FROM posts WHERE post_id = ?',
  getPostsListByUserId: 'SELECT * FROM posts WHERE uid = ?',
  getPostsListByRegion: 'SELECT * FROM posts',
  getPostAvailabilityByPostId: 'SELECT * FROM availability WHERE pid = ?',
  newAvailability: 'INSERT INTO availability(week_day, start_time, end_time, pid, hourly_rate) VALUES(?, ?, ?, ?, ?)',
  removeAvailabilityForPost: 'DELETE FROM availability WHERE pid = ?'
};

module.exports = apiSql;