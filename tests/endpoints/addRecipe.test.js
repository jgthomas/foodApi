import Dynamo from '../../lambdas/common/dynamo';
import Helper from '../../lambdas/common/helper';
import addRecipes from '../../lambdas/endpoints/addRecipes';
import recipeValid from '../data/recipeValid.json';
import recipeValidAlt from '../data/recipeValidAlt.json';
import recipeInvalid from '../data/recipeInvalid.json';
import recipeInvalidAlt from '../data/recipeInvalidAlt.json';

describe('addRecipes endpoint', () => {
  describe('Valid recipes submission', () => {
    it('Should return a 200 response for a valid submission', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.resolve());
      const payload = Helper.convertToPayload(recipeValid);
      const response = await addRecipes(payload);
      expect(response.statusCode).toBe(200);
    });

    it('Should return a 200 response for a valid submission with alt ingredient', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.resolve());
      const payload = Helper.convertToPayload(recipeValidAlt);
      const response = await addRecipes(payload);
      expect(response.statusCode).toBe(200);
    });

    it('Should return a 400 response if failing to write to db', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.reject());
      const payload = Helper.convertToPayload(recipeValid);
      const response = await addRecipes(payload);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Invalid recipes submission', () => {
    it('Should fail validation for payload missing ID', async () => {
      const payload = Helper.convertToPayload(recipeInvalid);
      const response = await addRecipes(payload);
      expect(response.statusCode).toBe(400);
    });

    it('Should fail validation for payload with invalid alt ingredient', async () => {
      const payload = Helper.convertToPayload(recipeInvalidAlt);
      const response = await addRecipes(payload);
      expect(response.statusCode).toBe(400);
    });
  });
});
