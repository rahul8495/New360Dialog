const express = require('express');
const router = express.Router();
const dialogflow = require('./dialogflow');
const settings = require('./settings');
const polly = require('./polly');
const upload = require('./upload')
const voicebot = require('./voicebot');
const zoko = require('./../controllers/zoko');
const wati = require('./../controllers/wati');
const i360dialog = require('./../controllers/360dialog');

router.get('/', (req, res) => 
    res.json({greetings: "welcome to dialogflow api service"}
));
router.get('/query/:text', async (req, res) => {
    try {
        const response = await dialogflow.query(req.params.text, req.query);  
        res.send({response});
    } catch (error) {
        res.send({error});
    }
});
router.post('/whatsauto', async (req, res) => {
    try {
        const response = await dialogflow.query(req.body.message, {project: req.query.project, sessionId: req.body.sender});  
        res.send({
            reply: response.fulfillmentMessages
                .filter(message => message.platform === "PLATFORM_UNSPECIFIED" && message.message === "text")
                .map(message => message.text.text[0])[0]
            });
    } catch (error) {
        res.send({error: error});
    }
});
router.post('/zoko', async (req, res) => {
    try {
        console.log("Hitting Zoko endpoint", req.body, req.query)
        const response = await dialogflow.query(req.body.text? req.body.text : req.body.fileUrl, {project: req.query.project, sessionId: req.body.platformSenderId})
        const messages = response.fulfillmentMessages
        .filter(message => message.platform === "PLATFORM_UNSPECIFIED")
        zoko.send(messages, req)
        res.send({status: 200})
    } catch (error){
        console.log(error)
        res.send({error: error})
    }
})
router.post('/wati', async (req, res) => {
    try {
        console.log("Hitting Wati endpoint", req.body, req.query)
        const response = await dialogflow.query(req.body.text? req.body.text : req.body.fileUrl, {project: req.query.project, sessionId: req.body.id})
        const messages = response.fulfillmentMessages
        .filter(message => message.platform === "PLATFORM_UNSPECIFIED")
        wati.send(messages, req)
        res.send({status: 200})
    } catch (error){
        console.log(error)
        res.send({error: error})
    }
})
router.post('/360dialog', async (req, res) => {
    if(req.body.messages){
        try {
            console.log("Hitting 360dialog endpoint", req.body, req.query)
            console.log("check interactive", req.body.messages[0].interactive);
            console.log("Text", req.body.messages[0].text);
            
            if(req.body.messages[0].text){
                console.log("INSIDE IF");
                var response = await dialogflow.query(req.body.messages[0].text.body, { project: req.query.project, sessionId: req.body.messages[0].from })
                console.log(response);
            }
            else if(req.body.messages[0].interactive.list_reply){
                var response = await dialogflow.query(req.body.messages[0].interactive.list_reply.id, { project: req.query.project, sessionId: req.body.messages[0].from })
            }
            else {
                var response = await dialogflow.query(req.body.messages[0].interactive.button_reply.id, { project: req.query.project, sessionId: req.body.messages[0].from })
            }
            //const response = await dialogflow.query(req.body.messages[0].text.body, { project: req.query.project, sessionId: req.body.messages[0].from })
            const messages = response.fulfillmentMessages
            .filter(message => message.platform === "PLATFORM_UNSPECIFIED")
            // console.log(messages)
            i360dialog.send(messages, req)
            console.log("respnse console",response.fulfillmentMessages);
            console.log("END");
            res.send({status: 200})
        } catch (error){
            console.log("ERROR",error)
            res.send({error: error})
        }
    }
})

router.get('/settings', settings);
router.post('/settings', settings);
router.post('/polly', polly);
router.post('/upload', upload);
router.post('/voicebot', voicebot);

module.exports = router;