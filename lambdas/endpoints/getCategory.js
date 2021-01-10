const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');

const categoryTable = process.env.categoryTableName;
const mainTable = process.env.mainTableName;

exports.handler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses.response400({ message: 'Missing the ID from the path' });
  }

  const { ID } = event.pathParameters;

  const category = await Dynamo.get(ID, categoryTable).catch(() => {
    return null;
  });

  if (!category) {
    return Responses.response400({
      message: `No category: ${ID}`,
    });
  }

  const foodsData = await Promise.all(
    category.members.map(async (member) => {
      Dynamo.get(member, mainTable).catch(() => {
        return { member: null };
      });
    }),
  );

  if (!foodsData) {
    return Responses.response400({
      message: `No food items found for category: ${ID}`,
    });
  }

  return Responses.response200({ foodsData });
};
