const Joi = require('joi');

const ID = Joi.string().alphanum().min(3).required();

const name = Joi.string()
  .regex(/^[a-zA-Z0-9 ]*$/)
  .min(3)
  .required();

const ingredient = Joi.object({
  ID,
  name,
  amount: Joi.number().min(1).required(),
});

const ingredients = Joi.object({
  ingredients: Joi.array().items(ingredient).min(1).required(),
});

const recipe = Joi.object({
  ID,
  name,
  ingredients: Joi.array()
    .items(Joi.object({ ID, alt: Joi.array().items(ID.optional()) }))
    .required(),
});

const recipes = Joi.object({ recipes: Joi.array().items(recipe) });

const Validate = {
  validateIngredients: (payload) => {
    return ingredients.validate(payload);
  },

  validateRecipes: (payload) => {
    return recipes.validate(payload);
  },
};

module.exports = Validate;
