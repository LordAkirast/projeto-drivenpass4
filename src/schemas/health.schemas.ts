import Joi from "joi";

const healthSchema = Joi.object({
    email: Joi.string().required(),
    name: Joi.string().required(),
})


export default healthSchema;