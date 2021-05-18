const fetch = require('node-fetch');
const moment = require('moment');
require('dotenv').config();

//const BOT_TOKEN = process.env.BOT_TOKEN || ``;
const BOT_TOKEN = process.env.HSN_BOT_TOKEN || ``;
const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
// const chat_id = process.env.CHAT_ID;
const chat_id = process.env.HSN_CHAT_ID;

const body = {
    chat_id,
    text : ''    
}
function sendMessage(text){
    const date = moment().format('HH:mm:ss A');
    body.text = text;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(function(resp){
        return resp.json();
    })
    .then(function(result){
        console.log(result);
    })
    .catch(function(error){
        console.log(error);
    })
}



module.exports = sendMessage;
