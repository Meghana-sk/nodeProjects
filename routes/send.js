var express = require('express');
var router = express.Router();

const service = require('../services')


router.post('/send', function (req, res) {
   const body = req.body;
   service(body,function(err,response){
    if(err){
        res.json({
            status: "error",
            error : err.message
        })
    }
    else{
        res.json({
            status: "ok",
            error : response
        })
    }
   },'gmail')
  });

  module.exports = router