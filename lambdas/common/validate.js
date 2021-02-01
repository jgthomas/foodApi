const Joi = require('joi');

const ingredient = Joi.object({
  ID: Joi.string().alphanum().min(3).required(),
  name: Joi.string()
    .regex(/^[a-zA-Z0-9 ]*$/)
    .min(3)
    .required(),
  amount: Joi.number().min(1).required(),
});

const ingredients = Joi.object({
  ingredients: Joi.array().items(ingredient).min(1).required(),
});

const Validate = {
  validateIngredients: (payload) => {
    return ingredients.validate(payload);
  },
};

module.exports = Validate;
