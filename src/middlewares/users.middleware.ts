import { Request, Response, NextFunction } from 'express';
import { usersSchema, usersIDSchema } from '../schemas/users.schemas';

export function validateUsersSchema(req: Request, res: Response, next: NextFunction) {
    const userBody = req.body;

    const { error } = usersSchema.validate(userBody);

    if (error) {
        return res.status(422).send(error.details[0].message);
    }

    next();
}

export function validateUserIDSchema(req: Request, res: Response, next: NextFunction) {
    const userBody = req.body;

    const { error } = usersIDSchema.validate(userBody);

    if (error) {
        return res.status(422).send(error.details[0].message);
    }

    next();
}


