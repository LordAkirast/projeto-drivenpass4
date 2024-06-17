import Joi, { number } from "joi";

export const networkSchema = Joi.object({
    title: Joi.string().email().required(),
    network: Joi.string().min(3).required(),
    password: Joi.string().min(3).required()
})

export const networkIDSchema = Joi.object({
    networkID: Joi.number().required(),
})