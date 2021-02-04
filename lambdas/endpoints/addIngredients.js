import Responses from '../common/responses';
import Dynamo from '../common/dynamo';
import Helper from '../common/helper';
import Validate from '../common/validate';

const tableName = process.env.ingredientsTableName;

const handler = async (event) => {
  const ingredientsData = JSON.parse(event.body);

  const { error } = Validate.validateIngredients(ingredientsData);
  if (error) {
    return Responses.response400({ message: error.message });
  }

  const { ingredients } = ingredientsData;

  const ingredientsResponse = await Promise.all(
    ingredients.map(async (ingredient) => {
      return Dynamo.write(ingredient, tableName).catch(() => {
        return { failMessage: `Failed to add ingredient: ${ingredient.name}` };
      });
    }),
  );

  if (Helper.errorInserting(ingredientsResponse)) {
    return Responses.response400({ ingredientsResponse });
  }

  return Responses.response200({ ingredientsResponse });
};

export default handler;
