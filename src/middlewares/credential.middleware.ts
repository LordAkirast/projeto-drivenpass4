import { Request, Response, NextFunction } from 'express';
import { credentialSchema, credentialIDSchema } from '../schemas/credential.schemas';

export function validateCredentialSchema(req: Request, res: Response, next: NextFunction) {
    const credentialBody = req.body;

    const { error } = credentialSchema.validate(credentialBody);

    if (error) {
        return res.status(422).send(error.details[0].message);
    }

    next();
}

export function validateUserIDSchema(req: Request, res: Response, next: NextFunction) {
    const credentialBody = req.body;

    const { error } = credentialIDSchema.validate(credentialBody);

    if (error) {
        return res.status(422).send(error.details[0].message);
    }

    next();
}


