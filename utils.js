module.exports = {
  ungarbleModalValues(vals) {
    const out = {};
    Object.values(vals).forEach((val) => {
      /* eslint-disable-next-line prefer-destructuring */
      out[Object.keys(val)[0]] = Object.values(val)[0];
    });
    return out;
  },
  async getDropdownValues(sheet) {
    const rows = await sheet.getRows("Settings");
    return {
      types: rows.map((row) => row.types).filter((option) => Boolean(option)),
      tags: rows.map((row) => row.tags).filter((option) => Boolean(option)),
    };
  },
};
