const Helper = {
  convertToPayload(data) {
    return { body: JSON.stringify(data) };
  },

  errorInserting(response) {
    return response[0].failMessage !== undefined;
  },

  chunk(array, size) {
    const chunkedArray = [];
    let index = 0;
    while (index < array.length) {
      chunkedArray.push(array.slice(index, size + index));
      index += size;
    }

    return chunkedArray;
  },
};

export default Helper;
