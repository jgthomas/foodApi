const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');

const tableName = process.env.mainTableName;

exports.handler = async (event) => {
  const foodData = JSON.parse(event.body);

  if (!foodData.count) {
    return Responses._400({ message: 'No count provided.' });
  }

  const newFood = await Dynamo.write(foodData, tableName).catch(() => {
    return null;
  });

  if (!newFood) {
    return Responses._400({ message: 'Failed to write food by ID' });
  }

  return Responses._200({ newFood });
};
