const axios = require('axios')
// const apikey = '81dfb37b-bae6-4272-9677-f0c773bebb0d';
const send = (messages, req) => {
    console.log(JSON.stringify(messages, null, 2))
    messages.forEach((message, index) => {
        setTimeout(() => {
            try{
                switch(message.message){
                    case "text":{
                        sendMessage(message.text.text[0], req)
                    } 
                    break;
                    case "payload":{
                        const payload = message.payload;
                        if(payload.fields.images){
                            const payloadValues = message.payload.fields.images.listValue.values;
                            payloadValues.forEach(value => {
                                const fields = value.structValue.fields;
                                const src = fields.src.stringValue;
                                const alt = fields.alt.stringValue;
                                sendMedia(src, alt, "image", req)
                            })
                        }
                        if(payload.fields.videos){
                            const payloadValues = message.payload.fields.videos.listValue.values;
                            payloadValues.forEach(value => {
                                const fields = value.structValue.fields;
                                const src = fields.src.stringValue;
                                const alt = fields.alt.stringValue;
                                sendMedia(src, alt, "video", req)
                            })
                        }
                        if(payload.fields.documents){
                            const payloadValues = message.payload.fields.documents.listValue.values;
                            payloadValues.forEach(value => {
                                const fields = value.structValue.fields;
                                const src = fields.src.stringValue;
                                const alt = fields.alt.stringValue;
                                sendMedia(src, alt, "document", req)
                            })
                        }
                    }
                    break;
                    default:{

                    }
                }
            } catch(err){
                console.log("error", err)
            }
        } , 500*index)  // to process messages sequentially
    }); 
}
const sendMessage = (message, req) => {
    return new Promise((resolve, reject) => {
        var data = JSON.stringify({"channel":"whatsapp","recipient":req.body.platformSenderId,"group":false,"type":"text","message":message,"caption":"string","assign":{"assigneeId":"string","override":true}});
        var config = {
            method: 'post',
            url: 'https://chat.zoko.io/v2/message',
            headers: { 
            'apikey': req.query.apikey, 
            'Content-Type': 'application/json'
            },
            data : data
        };  
        axios(config)
        .then(function (response) {
            resolve(response.data);
        })
        .catch(function (error) {
            console.log(error)
            reject(error);
        });
    })
}
const sendMedia = (mediaUrl, caption, type, req) => {
    console.log("Send Media function called", mediaUrl, caption, type, req)
    return new Promise((resolve, reject) => {
        var data = JSON.stringify({"channel":"whatsapp","recipient":req.body.platformSenderId,"group":false,"type":type,"message":mediaUrl,"caption":caption,"assign":{"assigneeId":"string","override":true}});
        var config = {
            method: 'post',
            url: 'https://chat.zoko.io/v2/message',
            headers: { 
            'apikey': req.query.apikey, 
            'Content-Type': 'application/json'
            },
            data : data
        };  
        axios(config)
        .then(function (response) {
            resolve(response.data);
        })
        .catch(function (error) {
            console.log(error)
            reject(error);
        });
    })
}

module.exports = {
    send,
    sendMessage
}