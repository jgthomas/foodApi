import Responses from '../common/responses';
import Dynamo from '../common/dynamo';
import Helper from '../common/helper';

const tableName = process.env.ingredientsTableName;

const handler = async (event) => {
  const ingredientsData = JSON.parse(event.body);
  const { ingredients } = ingredientsData;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return Responses.response400({ message: 'No ingredients requested.' });
  }

  const chunkedIngredients = Helper.chunk(ingredients, 100);

  const ingredientsResponse = await Dynamo.batchGet(
    chunkedIngredients,
    tableName,
  ).catch(() => {
    return null;
  });

  return Responses.response200({ ingredientsResponse });
};

export default handler;
