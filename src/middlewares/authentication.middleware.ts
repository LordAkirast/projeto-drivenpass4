import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient()

export async function authenticationValidation(req: Request, res: Response, NextFunction: NextFunction) {
    const { authorization } = req.headers


    if (!authorization) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const userToken = authorization.split(' ')[1]

    if (!userToken) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    const verifyToken = await prisma.sessions.findFirst({
        where: {token : userToken}
    })

    //console.log(verifyToken)

    if (!verifyToken) {
        return res.status(401).json({error: 'Token not found!'})
    }

    ///res.locals.variavel = algum valor
    ///depois no controller
    ///const user = res.locals.variavel
    ///ai pode user const token = user.token
    res.locals.users = verifyToken
    NextFunction()
}
