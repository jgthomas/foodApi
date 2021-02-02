const Responses = require('../common/responses');
const Dynamo = require('../common/dynamo');
const Helper = require('../common/helper');
const Validate = require('../common/validate');

const tableName = process.env.recipeTableName;

exports.handler = async (event) => {
  const recipesData = JSON.parse(event.body);

  const { error } = Validate.validateRecipes(recipesData);
  if (error) {
    return Responses.response400({ message: error.message });
  }

  const { recipes } = recipesData;

  const recipesResponse = await Promise.all(
    recipes.map(async (recipe) => {
      return Dynamo.write(recipe, tableName).catch(() => {
        return `Failed to add recipes: ${recipes.name}`;
      });
    }),
  );

  if (Helper.errorInserting(recipesResponse)) {
    return Responses.response400({ recipesResponse });
  }

  return Responses.response200({ recipesResponse });
};
