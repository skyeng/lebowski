const { WebClient } = require("@slack/web-api");

const secrets = require("../config/secrets");
const messages = require("../messages");

const web = new WebClient(secrets.slack.token);

module.exports = (logger) => async (payload) => {
  try {
    await web.views.open({
      /* eslint-disable camelcase */
      trigger_id: payload.trigger_id,
      view: messages.logWork(payload.actions[0].value, payload.channel.id),
      /* eslint-enable camelcase */
    });
  } catch (error) {
    logger.error(error);
  }
}