const moment = require("moment");

class TicketManager {
  constructor(sheet) {
    this.sheet = sheet;
  }

  formatDate(date) {
    return date ? moment(date).format("MM/DD/YYYY HH:mm:ss") : null;
  }

  serializeTicket({
    ticketID,
    messageTS,
    botMessageTS,
    channel,
    text,
    createdAt,
    acknowledgedAt,
    closedAt,
    closedBy,
    tag,
    type,
    notes,
    reporter,
  }) {
    return [
      ticketID,
      messageTS,
      botMessageTS,
      channel,
      text,
      this.formatDate(createdAt),
      this.formatDate(acknowledgedAt),
      this.formatDate(closedAt),
      closedBy,
      tag,
      type,
      notes,
      reporter,
    ];
  }

  async getTicketWithID(id) {
    const rows = await this.sheet.getRows("Tickets");
    return rows.find(row => {
      return row.ticketID === id;
    });
  }

  async getTicketWithTS(ts) {
    const rows = await this.sheet.getRows("Tickets");
    return rows.find((row) => {
      return row.messageTS === `T${ts}`;
    });
  }

  async updateTicket(rowNumber, ticket) {
    return this.sheet.updateRow(
      "Tickets",
      rowNumber,
      this.serializeTicket(ticket)
    );
  }

  async createTicket(ticket) {
    return this.sheet.addRow("Tickets", this.serializeTicket(ticket));
  }
}

module.exports = TicketManager;
