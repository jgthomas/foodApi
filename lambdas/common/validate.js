const Joi = require('joi');

const ingredient = Joi.object({
  id: Joi.string().alphanum().min(3).required(),
  name: Joi.string().alphanum().min(3).required(),
  amount: Joi.number().min(1).required(),
});

const ingredients = Joi.array().items(ingredient).min(1).required();

const schemas = {
  ingredients,
};

const validateSchema = (schema, payload) => {
  return schemas.schema.validate(payload);
};

const validateIngredients = (payload) => {
  return validateSchema('ingredients', payload);
};

module.exports = validateIngredients;
