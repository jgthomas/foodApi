const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');
const Validate = require('../common/validate');

const tableName = process.env.ingredientsTableName;

exports.handler = async (event) => {
  const ingredientsData = JSON.parse(event.body);

  const { error } = Validate.validateIngredients(ingredientsData);
  if (error) {
    throw error;
  }

  const { ingredients } = ingredientsData;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return Responses.response400({ message: 'No ingredients submitted.' });
  }

  const ingredientsResponse = await Promise.all(
    ingredients.map(async (ingredient) => {
      return Dynamo.write(ingredient, tableName).catch(() => {
        return Responses.response400({
          message: `Failed to add ingredients: ${ingredientsData}`,
        });
      });
    }),
  );

  return Responses.response200({ ingredientsResponse });
};
