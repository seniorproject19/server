var express = require('express');
var multer = require('multer');
var fs = require('fs');
var router = express.Router();

var mysql = require('mysql');

var dbConfig = require('../conf/db');
var authSQL = require('../db/authSql');
var apiSQL = require('../db/apiSql');

var pool = mysql.createPool(dbConfig.mysql);

var responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.status(500).json({
      code: 500,
      msg: 'error while creating user'
    });
  } else {
    res.status(ret.code).json(ret);
  }
}

router.get('/user', function(req, res, next) {
  sessionUser = null;
  if (req.session && req.session.uid) {
    sessionUser = req.session.uid;
  }

  if (sessionUser != null) {
    console.log("authenticated");
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
            console.log(retVal);
          }
          responseJSON(res, retVal);   
          connection.release();  
        });
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      msg: 'unauthorized'
    })
  }
});

router.get('/post/get_list', function(req, res, next) {
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
        connection.query(apiSQL.getPostsListByUserId, [sessionUser], function(err, result) {
          if (err) {
            console.log(err);
          }
          retVal = {};
          postList = [];
          for (var i=0; i<result.length; i++) {
            let resultEntry = result[i];
            let pid = resultEntry.pid;
            let title = resultEntry.title;
            let address = resultEntry.address_1;
            let longitude = resultEntry.longitude;
            let latitude = resultEntry.latitude;
            postList.push({
              pid: pid,
              title: title,
              address: address,
              longitude: longitude,
              latitude: latitude
            });
          }
          retVal = {
            code: 200,
            data: postList
          };
          responseJSON(res, retVal);   
          connection.release();  
        });
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      msg: 'unauthorized'
    })
  }
});

router.get('/post/get_list/region', function(req, res, next) {
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
        connection.query(apiSQL.getPostsListByRegion, [], function(err, result) {
          if (err) {
            console.log(err);
          }
          retVal = {};
          postList = [];
          for (var i=0; i<result.length; i++) {
            let resultEntry = result[i];
            let pid = resultEntry.pid;
            let title = resultEntry.title;
            let address = resultEntry.address_1;
            let longitude = resultEntry.longitude;
            let latitude = resultEntry.latitude;
            postList.push({
              pid: pid,
              title: title,
              address: address,
              longitude: longitude,
              latitude: latitude
            });
          }
          retVal = {
            code: 200,
            data: postList
          };
          responseJSON(res, retVal);   
          connection.release();  
        });
      }
    });
  } else {
    res.status(401).json({
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
  let date_posted = req.body.date_posted;
  let city = req.body.city;
  let state = req.body.state;
  let zipcode = req.body.zipcode;
  let title = req.body.title;
  let description = req.body.description;
  let rateData = '';

  sessionUser = null;
  if (req.session && req.session.uid) {
    sessionUser = req.session.uid;
  }

  if (sessionUser != null) {
    let post_id = sessionUser + '_' + (new Date().getTime());;
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        responseJSON(res, undefined);
      } else {
        retVal = {};
        connection.query(apiSQL.newPost, [post_id, sessionUser, date_posted, title, description, longitude, latitude, address_1, address_2, city, state, zipcode, rateData], function(err, result) {
          if (err) {
            retVal = {
              code: 500,
              msg: 'server_error'
            }
            responseJSON(res, retVal);
            connection.release();
          } else {
            console.log(post_id);
            connection.query(apiSQL.getPostByPostId, [post_id], function(err, result) {
              if (err) {
                console.log(err);
              }
              if (result.length == 0) {      
                retVal = {   
                  code: 500,   
                  msg: 'internal server error'
                };
              } else {
                let pid = result[0].pid;
                retVal = {
                  code: 200,
                  msg: pid
                }
              }
              responseJSON(res, retVal);   
              connection.release();  
            });
          }
        });
      }
    });
  } else {
    res.status(401).json({
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

  console.log(availabilityData)

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
        // add new availability
        for (var i=0; i<availabilityData.length; i++) {
          let weekday = availabilityData[i].weekday
          let startTime = availabilityData[i].start;
          let endTime = availabilityData[i].end;
          let hourlyRate = availabilityData[i].rate;
          connection.query(apiSQL.newAvailability, [weekday, startTime, endTime, pid, hourlyRate], function(err, result) {
            if (err) {
              console.log(err);
              retVal = {
                code: 500,
                msg: 'server_error'
              }
              responseJSON(res, retVal);
              return;
            } else {
              retVal = {
                code: 200,
                msg: 'success'
              }
              responseJSON(res, retVal);
            }
          });
        }
      });

      connection.release();  
    });
  });
});

router.get('/post/get/:pid', function(req, res) {
  let pid = req.params.pid;
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      responseJSON(res, undefined);
      return;
    }
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

      retVal = {
        code: 200,
        date_posted: result[0].date_posted,
        title: result[0].title,
        description: result[0].description,
        longitude: result[0].longitude,
        latitude: result[0].latitude,
        address: result[0].address_1
      }

      responseJSON(res, retVal);
      connection.release();  
    });
  });
});

router.get('/post/image/list/:pid', function(req, res) {
  let pid = req.params.pid;
  let path = 'public/uploads/images/' + pid;
  fileList = []
  fs.readdir(path, function(err, items) {
    for (var i=0; i<items.length; i++) {
      var file = '/uploads/images/' + pid + '/' + items[i];
      fileList.push(file);
    }
    retVal = {
      code: 200,
      file_paths: fileList
    };
    responseJSON(res, retVal);
  });
});

// TODO: check post uid with authenticated user
router.post('/upload/images/:pid', function(req, res) {
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

  let pid = req.params.pid;

  pool.getConnection(function(err, connection) {
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

      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          let dest = 'public/uploads/images/' + pid + '/';
          try {
              stat = fs.statSync(dest);
          } catch (err) {
              fs.mkdirSync(dest);
          }
          cb(null, dest);
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        }
      });
      
      var upload = multer({ storage: storage, limits: { fieldSize: 2 * 1024 * 1024 } });

      upload.single('file')(req, res, function(err) {
        if (err) {
          console.log("Error uploading file: " + err);
          return;
        }
      })

      connection.release();  
    });
  });
});

module.exports = router;
