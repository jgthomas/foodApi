const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');

const tableName = process.env.mainTableName;

exports.handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses._400({ message: 'Missing the food ID from the path' });
  }

  const ID = event.pathParameters.ID;

  const food = await Dynamo.get(ID, tableName).catch(() => {
    return null;
  });

  if (!food) {
    return Responses._400({ message: `Failed to get food using ID: ${ID}` });
  }

  return Responses._200({ food: food });
};
