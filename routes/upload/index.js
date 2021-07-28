const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
const axios = require("axios")
const fs = require("fs")

const getSettings = async (admin) => {
  const settings = await axios.get('https://axlewebtech.com/scripts/json/.generic_settings/settings.json')
  if(admin.name && admin.email){
    const admins = {
        admins: []
    };
    admins.admins.push({
        name: admin.name,
        email: admin.email
    })
    console.log(settings.data)
    settings.data.live_chat = admins;
  }  
  return settings
}

const localFilePath = __dirname + "/uploaded-files";
const remoteFilePath = "/public_html/axlewebtech.com/scripts/json";
const config = {
    user: "anshul",
    password: "I93JIingZWujhnc",
    host: "ftp.axlewebtech.com",
    port: 21,
    localRoot: localFilePath,
    remoteRoot: '',
    include: ["*.json"],
    exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
    deleteRemote: false,
    forcePasv: true
  };

module.exports = async (req, res) => {
    if(req.files === null){
        return res.status(400).json({msg: 'No Files Uploaded'});
    }

    const file = req.files.file;     
    file.mv(`${__dirname}/uploaded-files/credentials.json`, async err => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        const fileData = fs.readFileSync(`${localFilePath}/credentials.json`,'utf8')
        const projectId = JSON.parse(fileData).project_id;
        config.remoteRoot = `${remoteFilePath}/${projectId}`; 

        // Copy Settings file
        getSettings(req.body).then(settings => {
            fs.writeFileSync(`${localFilePath}/settings.json`, JSON.stringify(settings.data, null, 4), 'utf-8')
        })

        // Initiate Deployment to FTP
        ftpDeploy
        .deploy(config)
        .then(res => console.log(res))
        .catch(err => reject(err));

        // Send Response
        res.json({fileName: file.name, projectId: projectId, message: 'File uploaded successfully'})
    });
}