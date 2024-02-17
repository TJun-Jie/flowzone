const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

function getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
}

async function getAccessToken(code) {
    const tokens = await clerk.users.getUserOauthAccessToken(code, "oauth_google");
    const token = tokens[0].token;
    console.log(tokens[0])
    oauth2Client.setCredentials({
        access_token: token,
    });
    return token
}

module.exports = { oauth2Client, getAuthUrl, getAccessToken };
