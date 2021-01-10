const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');

const tableName = process.env.ingredientsTableName;

exports.handler = async (event) => {
  const ingredientsData = JSON.parse(event.body);
  const { ingredients } = ingredientsData;

  if (!ingredients || ingredients.length === 0) {
    return Responses.response400({ message: 'No ingredients submitted.' });
  }

  const ingredientsResponse = await Promise.all(
    ingredientsData.map(async (ingredient) => {
      return Dynamo.write(ingredient, tableName).catch(() => {
        return Responses.response400({
          message: `Failed to add ingredients: ${ingredientsData}`,
        });
      });
    }),
  );

  return Responses.response200({ ingredientsResponse });
};
