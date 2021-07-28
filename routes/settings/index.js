const ftpDeploy = require('./ftp');
const axios = require('axios');
const host = 'https://axlewebtech.com/scripts/json';

const getSettings = (req, res) => {
    if(!req.query.project){
        res.send('project parameter is mandatory');
    } else {
        const config = { headers: {'Content-Type': 'application/json','Cache-Control' : 'no-cache'}};
        axios.get(`${host}/${req.query.project}/settings.json`, config)
        .then(response => res.send({response: response.data}))
        .catch(err => res.send(err.response.status))
    }   
}

const updateSettings = (req, res) => {
    if(!req.query.project){
        res.send('project parameter is mandatory');
    } else {
        ftpDeploy(req)
        res.json({message: 'Data updated'})
    }    
}

module.exports = async (req, res) => {
    if(req.method == "GET"){
        getSettings(req, res)
    } else if (req.method == "POST"){
        updateSettings(req, res)
    }
}