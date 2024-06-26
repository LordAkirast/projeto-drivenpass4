import { Request, Response, NextFunction } from 'express';
import { healthSchema, healthUpdateSchema } from "../schemas/health.schemas";

export function validateHealthSchema(req: Request, res: Response, next: NextFunction) {
    const healthBody = req.body;

    const { error } = healthSchema.validate(healthBody);

    if (error) {
        return res.status(422).send(error.details[0].message);
    }

    next();
}


export function validateHealthUpdateSchema(req: Request, res: Response, next: NextFunction) {
    const healthBody = req.body

    const { value, error } = healthUpdateSchema.validate(healthBody)
    if (error) {
        return res.status(422).send(error.details[0].message)
    }

    next();
}