const express = require('express');
const fileUpload = require('express-fileupload'); 
const routes = require('./routes');
const bodyParser = require('body-parser');
const headers = require('./headers');

const api = express();
api.use(bodyParser.urlencoded({extended: true}));
api.use(bodyParser.json());
api.use(headers);
api.use(fileUpload()); 

api.use('/dialogflow', routes);

const port = process.env.PORT || 3001
api.listen(port, () => {
    console.log(`Listening on port ${port}`);
});