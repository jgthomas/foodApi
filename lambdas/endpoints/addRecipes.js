const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');

const tableName = process.env.recipeTableName;

exports.handler = async (event) => {
  const recipesData = JSON.parse(event.body);
  const { recipes } = recipesData;

  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return Responses.response400({ message: 'No recipes submitted.' });
  }

  const recipesResponse = await Promise.all(
    recipes.map(async (recipe) => {
      return Dynamo.write(recipe, tableName).catch(() => {
        return Responses.response400({
          message: `Failed to add recipes: ${recipesData}`,
        });
      });
    }),
  );

  return Responses.response200({ recipesResponse });
};
