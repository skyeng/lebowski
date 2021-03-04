const { google } = require("googleapis");
const moment = require("moment");
const secrets = require("../config/secrets");

class Sheet {
  constructor(sheetID) {
    const client = new google.auth.JWT(
      secrets.google.client_email,
      null,
      secrets.google.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    this.client = google.sheets({
      version: "v4",
      auth: client,
    });
    this.sheetID = sheetID;
  }

  async getRows(sheet) {
    const res = await this.client.spreadsheets.values.get({
      spreadsheetId: this.sheetID,
      range: sheet,
    });
    const header = res.data.values[0];

    const rows = res.data.values.slice(1);

    return rows.map((cells, rowIndex) => {
      const obj = {};
      cells.forEach((cellContents, cellIndex) => {
        if (cellContents.match(/\d?\d\/\d?\d\/\d\d\d\d \d?\d:\d?\d:\d?\d/)) {
          obj[header[cellIndex]] = moment(cellContents, "MM/DD/YYYY HH:mm:ss").toDate();
        } else {
          obj[header[cellIndex]] = cellContents;
        }
      });
      obj.rowNumber = rowIndex + 2;
      return obj;
    });
  }

  async updateRow(sheet, rowNumber, values) {
    return this.client.spreadsheets.values.update({
      spreadsheetId: this.sheetID,
      range: `${sheet}!A${rowNumber}:Z${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [values],
      },
    });
  }

  async addRow(sheet, values) {
    return this.client.spreadsheets.values.append({
      spreadsheetId: this.sheetID,
      range: `${sheet}!A:Z`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [values],
      },
    });
  }
}

module.exports = Sheet;
