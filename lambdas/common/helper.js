const Helper = {
  convertToPayload(data) {
    return { body: JSON.stringify(data) };
  },

  errorInserting(response) {
    return response[0].failMessage !== undefined;
  },
};

export default Helper;
