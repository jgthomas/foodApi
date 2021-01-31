const addIngredients = require('../../lambdas/endpoints/addIngredients');
const ingredientsMissing = require('../data/ingredientsMissing.json');

const convertToPayload = (data) => {
  const payload = JSON.stringify(data);
  return { body: payload };
};

describe('addIngredients endpoint', () => {
  it('Should fail validation for an empty payload', async () => {
    const payload = convertToPayload(ingredientsMissing);
    const response = await addIngredients.handler(payload);
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).toBe(400);
    expect(responseBody.message).toBe(
      '"ingredients" must contain at least 1 items',
    );
  });
});
