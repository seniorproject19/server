var apiSql = {
  newPost: 'INSERT INTO posts(post_id, uid, date_posted, title, description, longitude, latitude, address_1, address_2, city, state, zipcode) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  getPost: 'SELECT * FROM posts WHERE pid = ?',
  getPostByPostId: 'SELECT * FROM posts WHERE post_id = ?',
  getPostsListByUserId: 'SELECT * FROM posts WHERE uid = ?',
  getPostsListByRegion: 'SELECT * FROM posts WHERE(latitude BETWEEN ? AND ?) AND (longitude BETWEEN ? AND ?)',
  getPostAvailabilityByPostId: 'SELECT * FROM availability WHERE pid = ?',
  getPostAvailabilityByPostIdAndWeekday: 'SELECT * FROM availability WHERE pid = ? AND week_day = ?',
  getPostAvailabilityByPostIds: function(pidsList) {
    var queryConditionString = '';
    for (var i=0; i<pidsList.length; i++) {
      let pid = pidsList[i];
      queryConditionString += 'pid = ' + pid;
      if (i != pidsList.length - 1) {
        queryConditionString += " OR "
      }
    }
    return 'SELECT * FROM availability WHERE ' + queryConditionString
  },
  newAvailability: 'INSERT INTO availability(week_day, start_time, end_time, pid, hourly_rate) VALUES(?, ?, ?, ?, ?)',
  removeAvailabilityForPost: 'DELETE FROM availability WHERE pid = ?',
  newRecord: 'INSERT INTO records(uid, owner_uid, pid, start_date, start_time, end_time, total_charges, plate, title, address, description, latitude, longitude) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  getRecordByUid: 'SELECT * FROM records WHERE uid = ?',
  getRecordByOwnerId: 'SELECT * FROM records WHERE owner_uid = ?',
  getRecordsInConflict: function(start, end, date, pidsList) {
    var pidConditions = '(';
    for (var i=0; i<pidsList.length; i++) {
      let pid = pidsList[i];
      pidConditions += 'pid = ' + pid;
      if (i != pidsList.length - 1) {
        pidConditions += " OR "
      }
    }
    pidConditions += ')';
    let dateCondition = '(start_date = \'' + date + '\')';
    let timeCondition1 = '(start_time <= ' + start + ' AND end_time > ' + start + ')';
    let timeCondition2 = '(start_time < ' + end + ' AND end_time >= ' + end + ')';
    let timeCondition3 = '(start_time >' + start + ' AND end_time < ' + end + ')';
    let timeCondition = '(' + timeCondition1 + ' OR ' + timeCondition2 + ' OR ' + timeCondition3 + ')';
    let conditions = pidConditions + ' AND ' + dateCondition + ' AND ' + timeCondition;
    return 'SELECT * FROM records WHERE ' + conditions;
  }
};

module.exports = apiSql;