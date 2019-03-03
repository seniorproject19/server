var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var dbConfig = require('../conf/db');
var authSQL = require('../db/authSql');

var pool = mysql.createPool(dbConfig.mysql);

var responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: 500,
      msg: 'error while creating user'
    });
  } else {
    res.json(ret);
  }
}

router.get('/user', function(req, res, next) {
  sessionUser = null;
  if (req.session && req.session.uid) {
    sessionUser = req.session.uid;
  }  

  if (sessionUser != null) {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        responseJSON(res, undefined);
      } else {
        connection.query(authSQL.getUserById, [sessionUser], function(err, result) {
          if (err) {
            console.log(err);
          }
          retVal = {};
          if (result.length == 0) {      
            retVal = {   
              code: 401,   
              msg: 'username_not_found'
            };
          } else {
            let email = result[0].email;
            let username = result[0].username;
            let uid = result[0].uid;
            let is_owner = result[0].is_owner;
            retVal = {
              code: 200,
              uid: uid,
              username: username,
              email: email,
              is_owner: is_owner
            }
          }
          responseJSON(res, retVal);   
          connection.release();  
        });
      }
    });
  } else {
    res.json({
      code: 401,
      msg: 'unauthorized'
    })
  }
});

router.post('/post/new', function(req, res, next) {
  let longitude = req.body.longitude;
  let latitude = req.body.latitude;
  let address_1 = req.body.address_1;
  let address_2 = req.body.address_2;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let title = req.body.title;
  let description = req.body.description;

  sessionUser = null;
  if (req.session && req.session.uid) {
    sessionUser = req.session.uid;
  }  

  if (sessionUser != null) {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        responseJSON(res, undefined);
      } else {
        connection.query(apiSQL.newPost, [sessionUser, date_posted, title, description, longitude, latitude, address_1, address_2, city, state, zipcode, rateData], function(err, result) {
          retVal = {
            code: 200,
            msg: 'success'
          }
          if (err) {
            retVal = {
              code: 500,
              msg: 'server_error'
            }
          }
          responseJSON(res, retVal);   
          connection.release();  
        });
      }
    });
  } else {
    res.json({
      code: 401,
      msg: 'unauthorized'
    })
  }
});

router.post('/post/availability', function(req, res, next) {
  sessionUser = null;
  if (req.session && req.session.uid) {
    sessionUser = req.session.uid;
  }

  if (sessionUser == null) {
    res.json({
      code: 401,
      msg: 'unauthorized'
    });
    return;
  }

  let pid = req.body.pid;
  let availabilityData = req.body.availabilityData;
  let availabilityJSON = JSON.parse(availabilityData);

  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      responseJSON(res, undefined);
      return;
    }

    // make sure the current user is not modifying other's posts
    connection.query(apiSQL.getPost, [pid], function(err, result) {
      if (err) {
        retVal = {
          code: 500,
          msg: 'server_error'
        }
        responseJSON(res, retVal);
        return;
      }

      if (result.length <= 0) {
        retVal = {
          code: 404,
          msg: 'illegal post id'
        }
        responseJSON(res, retVal);
        return;
      }

      if (result[0].uid != sessionUser) {
        retVal = {
          code: 401,
          msg: 'unauthorized'
        }
        responseJSON(res, retVal);
        return;
      }

      // remove all previously entered availability
      connection.query(apiSQL.removeAvailabilityForPost, [pid], function(err, result) {
        if (err) {
          retVal = {
            code: 500,
            msg: 'server_error'
          }
          responseJSON(res, retVal);
          return;
        }
      });

      // add new availability
      for (var key in availabilityJSON) {
        if (availabilityJSON.hasOwnProperty(key)) {
          for (var entry in availabilityJSON[key]) {
            let startTime = entry[key]['start_time'];
            let endTime = entry[key]['end_time'];
            let hourlyRate = entry[key]['hourlyRate'];
            connection.query(apiSQL.newAvailability, [key, startTime, endTime, hourlyRate, pid], function(err, result) {
              if (err) {
                retVal = {
                  code: 500,
                  msg: 'server_error'
                }
                responseJSON(res, retVal);
                return;
              }
            });
          }
        }
      }

      connection.release();  
    });
  });
});


module.exports = router;
