const timeParser = require("./timeparser");

class WorklogManager {
  constructor(sheet) {
    this.sheet = sheet;
  }

  serializeWorklog({ ticketID, username, timeSpent, notes }) {
    return [ticketID, username, timeSpent, notes];
  }

  async logWork(ticketID, username, time, notes) {
    const logs = await this.sheet.getRows("Worklog");
    const worklog = logs.find((log) => {
      return log.ticketID === ticketID && log.username === username;
    });

    if (!worklog) {
      return this.sheet.addRow(
        "Worklog",
        this.serializeWorklog({
          ticketID,
          username,
          timeSpent: timeParser.serialize(timeParser.parse(time)),
          notes: `${timeParser.serialize(
            timeParser.parse(time)
          )}: ${notes}\n\n`,
        })
      );
    }

    return this.sheet.updateRow(
      "Worklog",
      worklog.rowNumber,
      this.serializeWorklog({
        ticketID,
        username,
        timeSpent: timeParser.serialize(
          timeParser.parse(worklog.timeSpent) + timeParser.parse(time)
        ),
        notes: `${worklog.notes} ${timeParser.serialize(timeParser.parse(time))}: ${notes}\n\n`,
      })
    );
  }
}
module.exports = WorklogManager;
