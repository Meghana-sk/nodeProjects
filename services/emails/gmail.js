const { google } = require('googleapis');

function send(mail, cb){
    
    let oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_SECRET_KEY,
        process.env.GOOGLE_CALLBACK
    );

    oAuth2Client.credentials={
        access_token: process.env.accessToken,
        refresh_token: process.env.refreshToken
    }

    const gmail = google.gmail({
        version: 'v1',
        auth: oAuth2Client
    });

    const utf8Subject = `=?utf-8?B?${Buffer.from(mail.subject).toString('base64')}?=`;
    const messageParts = [
        `From: ${mail.name} <${mail.from}>`,
        `To: ${mail.to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        `${mail.html}`,
    ];

    const message = messageParts.join('\n');


    async function sendEmail () {
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });
        return res.data;
    }

    let dataWait = sendEmail();
    dataWait.then(function(data){
        cb(null,data);
    })
    .catch(function(err){
        cb(err);
    });


}

module.exports = send;
