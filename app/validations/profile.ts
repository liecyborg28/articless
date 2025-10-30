import Joi from "joi";

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().required(),
});
