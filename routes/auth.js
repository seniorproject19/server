var express = require('express');
var router = express.Router();

var mysql = require('mysql');

var dbConfig = require('../conf/db');
var authSQL = require('../db/authSql');

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

router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let pwd = req.body.pwd;
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      responseJSON(res, undefined);
    } else {
      connection.query(authSQL.getUserByUsername, [username], function(err, result) {
        if (err) {
          retVal = {   
            code: 500,   
            msg: 'db_error'
          };
          console.log(err);
        }
        retVal = {};
        if (result.length == 0) {      
          retVal = {   
            code: 401,   
            msg: 'username_not_found'
          };
        } else if (result[0].pwd != pwd) {
          retVal = {   
            code: 401,   
            msg: 'incorrect_password'
          };
        } else {
          let uid = result[0].uid;
          req.session.uid = uid;
          retVal = {
            code: 200,
            msg: uid
          }
        }
        responseJSON(res, retVal);   
        connection.release();  
      });
    }
  });
});

router.post('/register', function(req, res, next) {
  let username = req.body.username;
  let pwd = req.body.pwd;
  let email = req.body.email;
  // let birthday = req.body.birthday;
  let isOwner = req.body.isOwner;
  let vehicleInfo = req.body.vehicle_info;
  console.log(vehicleInfo);
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      responseJSON(res, undefined);
    } else {
      connection.query(authSQL.insert, [username, pwd, email, null, null, isOwner, vehicleInfo], function(err, result) {
        if (err) {
          console.log(err);
        }
        if (result) {      
          result = {   
            code: 200,   
            msg:'success'
          };  
        }
        responseJSON(res, result);   
        connection.release();  
      });
    }
  });
});

router.post('/logout', function(req, res, next) {
  req.session.uid = null;
  responseJSON(res, {
    code: 200,
    msg: 'logout'
  });
});

module.exports = router;
