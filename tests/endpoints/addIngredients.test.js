import Dynamo from '../../lambdas/common/dynamo';
import Helper from '../../lambdas/common/helper';
import addIngredients from '../../lambdas/endpoints/addIngredients';
import ingredientsMissing from '../data/ingredientsMissing.json';
import ingredientsValid from '../data/ingredientsValid.json';

describe('addIngredients endpoint', () => {
  describe('Invalid ingredients submission', () => {
    it('Should fail validation for an empty payload', async () => {
      const payload = Helper.convertToPayload(ingredientsMissing);
      const response = await addIngredients(payload);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Valid ingredients submission', () => {
    it('Should return a 200 response for a valid submission', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() =>
        Promise.resolve('Success').then((value) => {
          return { value };
        }),
      );
      const payload = Helper.convertToPayload(ingredientsValid);
      const response = await addIngredients(payload);
      expect(response.statusCode).toBe(200);
    });

    it('Should return a 400 response if failing to write to db', async () => {
      jest.spyOn(Dynamo, 'write').mockImplementation(() => Promise.reject());
      const payload = Helper.convertToPayload(ingredientsValid);
      const response = await addIngredients(payload);
      expect(response.statusCode).toBe(400);
    });
  });
});
