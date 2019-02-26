var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  sessionUser = null;
  if (req.session && req.session.uid) {
    sessionUser = req.session.uid;
  }  

  if (sessionUser != null) {
    res.json({
      code: 200,
      msg: 'logged in user: ' + req.session.uid
    })
  } else {
    res.json({
      code: 401,
      msg: 'unauthorized'
    })
  }
});

module.exports = router;
