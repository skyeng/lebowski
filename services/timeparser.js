module.exports = {
  parse(timeString) {
    if (timeString.match(/^(\d*):\d\d$/)) {
      return (
        parseInt(timeString.match(/(\d*)/g)[0], 10) * 60 * 60 * 1000 +
        parseInt(timeString.match(/(\d*)/g)[2], 10) * 60 * 1000
      );
    }

    if (timeString.match(/^(\d*)$/)) {
      return parseInt(timeString.match(/(\d*)/)[0], 10) * 60 * 1000;
    }

    throw new Error("Invalid time formst");
  },

  serialize(milliseconds) {
    return `${Math.floor(milliseconds / 3600000)}:${
      (milliseconds % 3600000) / 60000
    }`;
  },
};
