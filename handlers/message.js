const { WebClient } = require("@slack/web-api");

const TicketManager = require("../services/ticketmanager");
const Sheet = require("../services/spreadsheet");

const projects = require("../config/projects");
const messages = require("../messages");
const secrets = require("../config/secrets");
const emoji = require("../config/emoji");

const web = new WebClient(secrets.slack.token);

module.exports = (logger) => async (event) => {
  try {
    const project = projects.find(
      ({channel}) => channel === event.channel
    );

    if (
      !project ||
      (event.subtype &&
        event.subtype !== "file_share" &&
        event.subtype !== "bot_message") ||
      event.thread_ts ||
      event.text.includes(`:${emoji.mute}:`)
    ) {
      return;
    }

    const sheet = new Sheet(project.sheet);
    const tickets = new TicketManager(sheet);

    const ticketID = Math.floor(Math.random() * 16777215)
      .toString(16)
      .toUpperCase()
      .padStart(6, "0"); // Creates a 6-char hexadecimal number

    const message = await web.chat.postMessage({
      /* eslint-disable camelcase */
      channel: event.channel,
      thread_ts: event.ts,
      blocks: messages.ticketCreated(ticketID),
      /* eslint-enable camelcase */
    });

    const { user } = await web.users.info({
      user: event.user ? event.user : event.text.match(/U([A-Z0-9]*)/g)[0], // Set either the sender as the reporter, or if the reporter is a bot, set the first tagged user
    });

    await tickets.createTicket({
      botMessageTS: `T${message.ts}`, // T is added to make sure that Google Sheets doesn't convert it to a number
      messageTS: `T${event.ts}`,
      text: project.preprocessText ? project.preprocessText(event.text) : event.text,
      ticketID,
      createdAt: new Date(),
      channel: message.channel,
      reporter: user.name,
    });
  } catch (error) {
    logger.error(error);
  }
}