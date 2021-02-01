const Dynamo = require('../../lambdas/common/dynamo');
const Helper = require('../../lambdas/common/helper');
const addIngredients = require('../../lambdas/endpoints/addIngredients');
const ingredientsMissing = require('../data/ingredientsMissing.json');
const ingredientsValid = require('../data/ingredientsValid.json');

describe('addIngredients endpoint', () => {
  describe('Invalid ingredients submission', () => {
    it('Should fail validation for an empty payload', async () => {
      const payload = Helper.convertToPayload(ingredientsMissing);
      const response = await addIngredients.handler(payload);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Valid ingredients submission', () => {
    it('Should return a 200 response for a valid submission', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.resolve());
      const payload = Helper.convertToPayload(ingredientsValid);
      const response = await addIngredients.handler(payload);
      expect(response.statusCode).toBe(200);
    });

    it('Should return a 400 response if failing to write to db', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.reject());
      const payload = Helper.convertToPayload(ingredientsValid);
      const response = await addIngredients.handler(payload);
      expect(response.statusCode).toBe(400);
    });
  });
});
