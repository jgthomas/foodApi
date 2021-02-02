const Dynamo = require('../../lambdas/common/dynamo');
const Helper = require('../../lambdas/common/helper');
const addRecipes = require('../../lambdas/endpoints/addRecipes');
const recipeValid = require('../data/recipeValid.json');
const recipeInvalid = require('../data/recipeInvalid.json');

describe('addRecipes endpoint', () => {
  describe('Valid recipes submission', () => {
    it('Should return a 200 response for a valid submission', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.resolve());
      const payload = Helper.convertToPayload(recipeValid);
      const response = await addRecipes.handler(payload);
      expect(response.statusCode).toBe(200);
    });

    it('Should return a 400 response if failing to write to db', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.reject());
      const payload = Helper.convertToPayload(recipeValid);
      const response = await addRecipes.handler(payload);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Invalid recipes submission', () => {
    it('Should fail validation for an invalid payload', async () => {
      const payload = Helper.convertToPayload(recipeInvalid);
      const response = await addRecipes.handler(payload);
      expect(response.statusCode).toBe(400);
    });
  });
});
