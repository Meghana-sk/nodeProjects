
require('dotenv').config();

// const API_KEY = process.env.API_KEY;
// const DOMAIN = process.env.DOMAIN

var API_KEY=process.env.MAILGUN_KEY
const DOMAIN=process.env.MAILGUN_DOMAIN
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const data = {
  from: `Meghana Keshavamurthy<meghanask97@gmail.com>`,
  to: 'meghanask97@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness through code!'
};

mailgun.messages().send(data, function(data,error){
    if(error){
        console.log(error)
    }
    else{
        console.log(data);
    }

}
);
