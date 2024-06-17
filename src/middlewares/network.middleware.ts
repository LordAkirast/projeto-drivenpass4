import { Request, Response, NextFunction } from 'express';
import { networkSchema, networkIDSchema } from '../schemas/network.schemas';

export function validateNetworkSchema(req: Request, res: Response, next: NextFunction) {
    const networkBody = req.body;

    const { error } = networkSchema.validate(networkBody);

    if (error) {
        return res.status(422).send(error.details[0].message);
    }

    next();
}

export function validateNetworkIDSchema(req: Request, res: Response, next: NextFunction) {
    const networkBody = req.body;

    const { error } = networkIDSchema.validate(networkBody);

    if (error) {
        return res.status(422).send(error.details[0].message);
    }

    next();
}


