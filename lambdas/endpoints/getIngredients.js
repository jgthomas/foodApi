import Responses from '../common/responses';
import Dynamo from '../common/dynamo';

const tableName = process.env.ingredientsTableName;

const handler = async (event) => {
  const ingredientsData = JSON.parse(event.body);
  const { ingredients } = ingredientsData;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return Responses.response400({ message: 'No ingredients requested.' });
  }

  const ingredientNames = ingredients.map((ingredient) => ingredient.ID);

  const ingredientsResponse = await Promise.all(
    ingredientNames.map(async (name) => {
      return Dynamo.get(name, tableName).catch(() => {
        return Responses.response400({
          message: `Failed to retrieve ingredients: ${ingredientsData}`,
        });
      });
    }),
  );

  return Responses.response200({ ingredientsResponse });
};

export default handler;
