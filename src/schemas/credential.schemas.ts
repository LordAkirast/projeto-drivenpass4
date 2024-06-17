import Joi, { number } from "joi";

export const credentialSchema = Joi.object({
    title: Joi.string().required(),
    url: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(3).required(),
})

export const credentialIDSchema = Joi.object({
    credentialID: Joi.number().required(),
})