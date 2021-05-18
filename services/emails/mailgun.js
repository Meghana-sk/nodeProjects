
require('dotenv').config();

// const API_KEY = process.env.API_KEY;
// const DOMAIN = process.env.DOMAIN

var API_KEY=process.env.MAILGUN_KEY
const DOMAIN=process.env.MAILGUN_DOMAIN
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

// const data = {
//   from: `Meghana Keshavamurthy<meghanask97@gmail.com>`,
//   to: 'meghanask97@gmail.com',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomeness through code!'
// };

function send(payload,cb){

    mailgun.messages().send(payload, function(err,response){
        if(err){
            cb(err)
        }
        else{
           cb(null,response);
        }
    
    }
    );
}

module.exports = send;

