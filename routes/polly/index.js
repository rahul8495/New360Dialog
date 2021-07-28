// Load the SDK
const AWS = require('aws-sdk')

// Create an Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'eu-west-1'
})

module.exports = async(req, res) => {
    Polly.synthesizeSpeech(req.body, (err, data) => {
        if (err) {
            console.log(err.code);
            res.send(err.code);
        } else if (data) {
            console.log("here");
            res.send({data});
        }
    })
}