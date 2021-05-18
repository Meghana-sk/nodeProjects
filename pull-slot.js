//API Documentation https://apisetu.gov.in/public/api/cowin

//take bot token and put in https://api.telegram.org/bot<bot_token>/getUpdates so that you get chat id of group

const fetch = require('node-fetch');
const moment = require('moment');

const sendMessage = require('./send-message');
const district_id = process.env.DISTRICT || 395;
setInterval(async function(){
    const date = moment().utc().utcOffset("+05:30").format('DD-MM-YYYY');
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${date}`;
    try{
        let resp =  await fetch(url,{
           headers: {
               "Content-Type": "application/json",
               "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36"
           }
       });
       try{
            const data = await resp.json();
            //const data = await resp.text();
            //console.log(data, url);
            if(!data || !data.centers ||!data.centers.length){
                return;
            }
            const centers = data.centers;
            let available = [];

            centers.forEach(function(item){
                let text = `[${item.fee_type}] ${item.name}, ${item.pincode}\n`;
                
                let sessions = item.sessions
                                .filter(item => !!item.available_capacity)
                                .map(function(sess){
                                    //console.log(sess.available_capacity)
                                    sess.available_capacity = parseInt(sess.available_capacity);
                                    const text = `[${sess.date} | ${sess.available_capacity} (${sess.min_age_limit}+) | ${sess.vaccine}]`;
                                    return text;
                                });

                sessions = sessions.join('\n');
                if(sessions){
                    text = `${text}${sessions}\n`; 
                    //console.log(text);
                    available.push(text);
                }              
            })

            const text = available.join("\n");
            if(!text){
                console.log("No slots avialable")
                return;
            }
            sendMessage(text)
        } catch(e){
            
            console.log(e, url);
        }
    }catch(e){
        console.log(e );
    }


},3000);
