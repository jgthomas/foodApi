const Dynamo = require('../../lambdas/common/dynamo');
const addIngredients = require('../../lambdas/endpoints/addIngredients');
const ingredientsMissing = require('../data/ingredientsMissing.json');
const ingredientsValid = require('../data/ingredientsValid.json');

const convertToPayload = (data) => {
  const payload = JSON.stringify(data);
  return { body: payload };
};

describe('addIngredients endpoint', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Invalid ingredients submission', () => {
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

  describe('Valid ingredients submission', () => {
    it('Should return a 200 response for a valid submission', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.resolve());
      const payload = convertToPayload(ingredientsValid);
      const response = await addIngredients.handler(payload);
      expect(response.statusCode).toBe(200);
    });

    it('Should return a 400 response if failing to write to db', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.reject());
      const payload = convertToPayload(ingredientsValid);
      const response = await addIngredients.handler(payload);
      expect(response.statusCode).toBe(400);
    });
  });
});
