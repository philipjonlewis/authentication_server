const Joi = require("joi").extend(require("@joi/date"));

const uuidValidationSchema = Joi.string()
  .guid({
    version: ["uuidv4", "uuidv5"],
  })
  .required();

const uuidValidationSchemaNotRequired = Joi.string().guid({
  version: ["uuidv4", "uuidv5"],
});

const stringContentValidationSchema = Joi.string().max(128).required();

const booleanValidationSchema = Joi.boolean()
  .required()
  //   .truthy("yes")
  //   .falsy("no")
  .sensitive();

const dateValidationSchema = Joi.date().required();

const numberValidationSchema = Joi.number();

export {
  uuidValidationSchema,
  uuidValidationSchemaNotRequired,
  stringContentValidationSchema,
  booleanValidationSchema,
  dateValidationSchema,
  numberValidationSchema
};
