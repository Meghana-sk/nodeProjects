// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'hi' });
// });

// module.exports = router;

//for gmail integration
var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
  if(process.env.accessToken){
    return res.json({ 
      accessToken: process.env.accessToken, 
      refreshToken: process.env.refreshToken 
    })
  }
  res.json({status: "ok"})
});

module.exports = router;

