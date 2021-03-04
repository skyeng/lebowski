const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;

module.exports = [
  {
    /**
     * Channel ID
     */
    channel: "CHUQB59DK",

    /**
     * Google Sheet ID, can be found in the URL
     */
    sheet: "15NmxG28Bqi5dXiegEnXSUD7O0dWk4jHnW6oSRZ7wECg",

    /**
     * Summaries to send
     */
    summariesToSend: ["daily", "weekly"],

    /**
     * Function to redact certain data (for example, email adresses or other personal data)
     * @param {string} text 
     */
    preprocessText: (text) => text.replace(emailRegex, "[REDACTED]"),
  },
];
