const moment = require("moment");
const lodash = require("lodash");

class StatsManager {
  constructor(sheet) {
    this.sheet = sheet;
  }

  async genMessage(isWeekly) {
    const allTickets = await this.sheet.getRows("Tickets");
    const yesterday = moment().subtract(1, "day");
    const tickets = allTickets.filter((ticket) =>
      moment(ticket.createdAt).isSame(yesterday, isWeekly ? "week" : "day")
    );

    const countByType = lodash.countBy(tickets, "type");
    const solvedCount = tickets.filter((ticket) => Boolean(ticket.closedBy)).length;

    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            `Статистика за ${isWeekly ? "прошлую неделю" : "вчерашний день"}`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_*По типам*_",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: Object.keys(countByType)
            .map((key) => `*${key || "None"}*: ${countByType[key]}`)
            .join("\n\n"),
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_*По статусам*_",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Ожидают решения*\n${tickets.length - solvedCount}`,
          },
          {
            type: "mrkdwn",
            text: `*Обработано*\n${solvedCount}`,
          },
          {
            type: "mrkdwn",
            text: `*Всего*\n${tickets.length}`,
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "хэв а найс дэй :gb-peace:",
        },
      },
    ];
  }
}

module.exports = StatsManager;
