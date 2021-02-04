import Responses from '../common/responses';
import Dynamo from '../common/dynamo';

const tableName = process.env.recipeTableName;

const handler = async (event) => {
  const recipesData = JSON.parse(event.body);
  const { recipes } = recipesData;

  if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
    return Responses.response400({ message: 'No recipes requested.' });
  }

  const recipeNames = recipes.map((recipe) => recipe.ID);

  const recipesResponse = await Promise.all(
    recipeNames.map(async (name) => {
      return Dynamo.get(name, tableName).catch(() => {
        return Responses.response400({
          message: `Failed to retrieve recipes: ${recipesData}`,
        });
      });
    }),
  );

  return Responses.response200({ recipesResponse });
};

export default handler;
