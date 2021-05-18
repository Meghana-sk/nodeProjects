

const mailgun = require('./emails/mailgun');
const gmail = require('./emails/gmail');

//exports.send = mailgun;


function selectESP(payload,cb,esp){
    if(esp === 'gmail' ){
        gmail(payload,cb);
    }
    else{
        gmail(payload,cb);
    }
}

module.exports = selectESP;