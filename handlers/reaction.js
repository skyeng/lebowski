const TicketManager = require("../services/ticketmanager");
const Sheet = require("../services/spreadsheet");

const projects = require("../config/projects");
const emoji = require("../config/emoji");

module.exports = (logger) => async (event) => {
  try {
    const project = projects.find(
      ({ channel: projectChannel }) => projectChannel === event.item.channel
    );

    if (!project || event.reaction !== emoji.workInProgress) {
      return;
    }

    const sheet = new Sheet(project.sheet);
    const tickets = new TicketManager(sheet);
    const ticket = await tickets.getTicketWithTS(event.item.ts);

    if (ticket.acknowledgedAt) {
      return;
    }

    ticket.acknowledgedAt = new Date();

    tickets.updateTicket(ticket.rowNumber, ticket);
  } catch (error) {
    logger.error(error);
  }
}