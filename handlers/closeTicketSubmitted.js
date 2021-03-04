const { WebClient } = require("@slack/web-api");

const TicketManager = require("../services/ticketmanager");
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
    const tickets = new TicketManager(sheet);
    const row = await tickets.getTicketWithID(ticketID);

    row.closedAt = new Date();
    row.type = values.type.selected_option.value;
    row.tag = values.tag.selected_option.value;
    row.notes = values.notes.value;

    const closedBy = await web.users.info({
      user: payload.user.id,
    });

    row.closedBy = closedBy.user.name;

    await tickets.updateTicket(row.rowNumber, row);

    await web.chat.update({
      channel: row.channel,
      ts: row.botMessageTS.replace("T", ""),
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:white_check_mark: Обращение ${row.ticketID} закрыто <@${payload.user.id}>`,
          },
        },
      ],
    });
  } catch (error) {
    logger.error(error);
  }
}