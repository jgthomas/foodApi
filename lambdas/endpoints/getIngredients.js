import Responses from '../common/responses';
import Dynamo from '../common/dynamo';
import Helper from '../common/helper';

const tableName = process.env.ingredientsTableName;
const batchSize = process.env.dynamoBatchSize;

const handler = async (event) => {
  const ingredientsData = JSON.parse(event.body);
  const { ingredients } = ingredientsData;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return Responses.response400({ message: 'No ingredients requested.' });
  }

  const chunkedIngredients = Helper.chunk(ingredients, batchSize);

  const ingredientsResponse = await Dynamo.batchGet(
    chunkedIngredients,
    tableName,
  ).catch(() => {
    return Responses.response400({
      message: `Failed to retrieve ingredients: ${ingredients.map(
        (ingredient) => ingredient.ID,
      )}. One or more ingredients not found.`,
    });
  });

  return Responses.response200({ ingredientsResponse });
};

export default handler;
