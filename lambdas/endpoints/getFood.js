const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');

const tableName = process.env.mainTableName;

exports.handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses.response400({ message: 'Missing the ID from the path' });
  }

  const { ID } = event.pathParameters;

  const food = await Dynamo.get(ID, tableName).catch(() => {
    return null;
  });

  if (!food) {
    return Responses.response400({
      message: `No food item found with name ${ID}`,
    });
  }

  return Responses.response200({ food });
};
