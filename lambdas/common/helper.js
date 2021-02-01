const Helper = {
  convertToPayload(data) {
    return { body: JSON.stringify(data) };
  },

  errorInserting(response) {
    return !response.every((elem) => elem === undefined);
  },
};

module.exports = Helper;
