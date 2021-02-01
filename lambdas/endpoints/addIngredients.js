const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');
const Helper = require('../common/helper');
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
        return `Failed to add ingredient: ${ingredient.name}`;
      });
    }),
  );

  if (Helper.errorInserting(ingredientsResponse)) {
    return Responses.response400({ ingredientsResponse });
  }

  return Responses.response200({ ingredientsResponse });
};
