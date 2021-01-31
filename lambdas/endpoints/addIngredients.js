const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');
const Validate = require('../common/validate');

const tableName = process.env.ingredientsTableName;

exports.handler = async (event) => {
  const ingredientsData = JSON.parse(event.body);

  const { error } = Validate.validateIngredients(ingredientsData);
  if (error) {
    return Responses.response400({ message: error.message });
  }

  const { ingredients } = ingredientsData;

  const ingredientsResponse = await Promise.all(
    ingredients.map(async (ingredient) => {
      return Dynamo.write(ingredient, tableName).catch(() => {
        return Responses.response400({
          message: `Failed to add ingredient: ${ingredient.name}`,
        });
      });
    }),
  );

  return Responses.response200({ ingredientsResponse });
};
