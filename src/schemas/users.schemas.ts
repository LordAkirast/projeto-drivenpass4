import Joi, { number } from "joi";

export const usersSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
})

export const usersIDSchema = Joi.object({
    userID: Joi.number().required(),
})