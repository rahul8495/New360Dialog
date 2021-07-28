const dialogflow = require('dialogflow').v2beta1;
const random = require('random');
const sessionId = random.int(0, 1000);
const axios = require('axios');
  
const query = async (text, query) => {
    const host = 'https://axlewebtech.com/scripts/json';
    const headers = { headers: {'Content-Type': 'application/json','Cache-Control' : 'no-cache'}};
    const credentials = await axios.get(`${host}/${query.project}/credentials.json`, headers);
    const settings = await axios.get(`${host}/${query.project}/settings.json`, headers);
    const json = credentials.data;
    const config = {
        credentials: {
            private_key: json.private_key,
            client_email: json.client_email
        }
    } 
    const sessionClient = new dialogflow.SessionsClient(config);
    const sessionPath = sessionClient.sessionPath(query.project, query.sessionId ? query.sessionId : sessionId);
    return new Promise( async (resolve, reject) => {
    const languageCode = query.langCode ? query.langCode : (settings.data.bot ? settings.data.bot.lang_code : "en-US");
    const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: languageCode,
                },
            outputAudioConfig: {
                    audioEncoding: 'OUTPUT_AUDIO_ENCODING_MP3',
                }
            },
        };
        try {
            const responses = await sessionClient.detectIntent(request)
            const result = responses[0].queryResult;
            resolve(result);
        } catch(err){
            reject(err);
        }
    });
}

module.exports = {
    query
};

