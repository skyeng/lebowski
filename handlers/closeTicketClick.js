const { WebClient } = require("@slack/web-api");

const Sheet = require("../services/spreadsheet");

const { getDropdownValues } = require("../utils");

const secrets = require("../config/secrets");
const projects = require("../config/projects");
const messages = require("../messages");

const web = new WebClient(secrets.slack.token);


module.exports = (logger) => async (payload) => {
  try {
    const project = projects.find(
      ({ channel: projectChannel }) => projectChannel === payload.channel.id
    );
    const sheet = new Sheet(project.sheet);

    const { types, tags } = await getDropdownValues(sheet);

    await web.views.open({
      /* eslint-disable camelcase */
      trigger_id: payload.trigger_id,
      view: messages.closeTicket(
        payload.actions[0].value,
        payload.user.id,
        payload.channel.id,
        types,
        tags
      ),
      /* eslint-enable camelcase */
    });
  } catch (error) {
    logger.error(error);
  }
}