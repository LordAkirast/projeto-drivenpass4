import Joi from "joi";

export const healthSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
})

export const healthUpdateSchema = Joi.object({
    id: Joi.number().required(),
    email: Joi.string().email(),
    name: Joi.string(),
})

export const healthEmailSchema = Joi.object({
    email: Joi.string().email().required()
})

export const healthIdSchema = Joi.object({
    id: Joi.number().required()
})
