const StatsManager = require("../services/statsmanager");
const Sheet = require("../services/spreadsheet");
const { WebClient } = require("@slack/web-api");

const projects = require("../config/projects");
const secrets = require("../config/secrets");

const web = new WebClient(secrets.slack.token);

async function start() {
  const promises = projects.map(async (project) => {
    if (project.summariesToSend && project.summariesToSend.includes("weekly")) {
      const sheet = new Sheet(project.sheet);
      const stats = new StatsManager(sheet);
      await web.chat.postMessage({
        channel: project.channel,
        blocks: await stats.genMessage(true),
        text: "Weekly summary :mute:",
      });
    }
  });

  await Promise.all(promises);
}

start();
