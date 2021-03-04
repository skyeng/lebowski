const { WebClient } = require("@slack/web-api");

const WorklogManager = require("../services/worklogmanager");
const Sheet = require("../services/spreadsheet");

const { ungarbleModalValues } = require("../utils");

const secrets = require("../config/secrets");
const projects = require("../config/projects");

const web = new WebClient(secrets.slack.token);

module.exports = (logger) => async (payload) => {
  try {
    const values = ungarbleModalValues(payload.view.state.values);
    const [ticketID, channel] = payload.view.private_metadata.split("|");

    const project = projects.find(
      ({ channel: projectChannel }) => projectChannel === channel
    );
    const sheet = new Sheet(project.sheet);
    const worklogs = new WorklogManager(sheet);

    const { user } = await web.users.info({
      user: payload.user.id,
    });

    worklogs.logWork(
      ticketID,
      user.name,
      values.amount.value,
      values.notes.value
    );
  } catch (error) {
    logger.error(error);
  }
}