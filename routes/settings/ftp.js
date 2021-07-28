const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
const axios = require("axios")
const fs = require("fs")

const localFilePath = __dirname + "/deployment-files"

const getSettings = async (project) => {
  const settings = await axios.get(`https://axleweb.tech/dialogflow/settings?project=${project}`)
  return settings
}

const config = (project) => {
  return (
    {
      user: "anshul",
      password: "I93JIingZWujhnc",
      host: "ftp.axlewebtech.com",
      port: 21,
      localRoot: localFilePath,
      remoteRoot: `/public_html/axlewebtech.com/scripts/json/${project}/`,
      include: ["*.json"],
      exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
      deleteRemote: false,
      forcePasv: true
    }
  );
} 

module.exports = (req) => {
    const project = req.query.project;
    const data = req.body;

    console.log("project", project)
    console.log("data", data)

    getSettings(project).then(settings => {
        const agents = settings.data.response.live_chat && settings.data.response.live_chat.agents? settings.data.response.live_chat.agents: []
        agents.push(data);
        settings.data.response.live_chat.agents = agents;
        console.log(JSON.stringify(settings.data.response, null, 4))
        fs.writeFileSync(`${localFilePath}/settings.json`, JSON.stringify(settings.data.response, null, 4), 'utf-8')
        ftpDeploy
          .deploy(config(project))
          .then(res => console.log("finished:", res))
          .catch(err => console.log(err));
    })
}

