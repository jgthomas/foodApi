const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');

const tableName = process.env.categoryTableName;

exports.handler = async (event) => {
  const categoryData = JSON.parse(event.body);

  if (
    !categoryData.members ||
    !Array.isArray(categoryData.members) ||
    categoryData.members.length === 0
  ) {
    return Responses.response400({
      message: 'No members of category provided.',
    });
  }

  const newCategory = await Dynamo.write(categoryData, tableName).catch(() => {
    return null;
  });

  if (!newCategory) {
    return Responses.response400({ message: 'Failed to add new category' });
  }

  return Responses.response200({ newCategory });
};
