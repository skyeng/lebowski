const { createEventAdapter } = require("@slack/events-api");
const { createMessageAdapter } = require("@slack/interactive-messages");

const logger = require('pino')({
  level: 'debug'
})

const express = require("express");

const secrets = require("./config/secrets");

const events = createEventAdapter(secrets.slack.signingSecret);
const interactions = createMessageAdapter(secrets.slack.signingSecret);
const app = express();

events.on("message", require("./handlers/message")(logger));
events.on("message.channels", require("./handlers/message")(logger));
events.on("reaction_added", require("./handlers/reaction")(logger));

interactions.action({ actionId: "log_work" }, require('./handlers/logWorkClick')(logger));
interactions.action({ actionId: "close_ticket" }, require('./handlers/closeTicketClick')(logger));

interactions.viewSubmission("log_work_modal", require('./handlers/logWorkSubmitted')(logger));
interactions.viewSubmission("close_ticket_modal", require('./handlers/closeTicketSubmitted')(logger));

app.use("/slack/action", interactions.requestListener());
app.use("/slack/events", events.requestListener());

app.get('/', (req, res) => res.json({ok: 'true'}));

app.listen(process.env.PORT || 5000, () => {
  logger.info(`Slack server is listening on port ${process.env.PORT || 5000}`);
  logger.debug('test');
});
