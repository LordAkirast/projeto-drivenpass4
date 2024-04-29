import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userBodyProtocol } from "../protocols/users.protocols";
import { EmailAlreadyExists, generalServerError, unauthorizedError } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { usersSchema } from "../schemas/users.schemas";
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient()

////o que eu não sei
////como usar corretamente o throw
///ambientes de produção
///authorization

export async function createUser(req: Request, res: Response) {
    const userBody = req.body as userBodyProtocol


    try {
        const verifyExistingUser = await prisma.user.findFirst({
            where: { email: userBody.email }
        })


        if (verifyExistingUser) {
            console.log('verifyExistingUser tem valor: ', verifyExistingUser)
            return res.status(409).send(EmailAlreadyExists.message)
        }

        await prisma.user.create({
            data: userBody
        })


        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

export async function loginUser(req: Request, res: Response) {
    const userBody = req.body as userBodyProtocol


    try {
        const verifyExistingUser = await prisma.user.findFirst({
            where: { email: userBody.email, password: userBody.password }
        })


        if (verifyExistingUser) {
            const accessToken = uuid();

            localStorage.setItem('accessToken', accessToken);
            ///isso salva o token na accessToken para pegar ele de volta tem que usar
            ///const token = localStorage.getItem('accessToken'); ai o token é salvo em token.

            const session = await prisma.sessions.create({
                data: {
                    email: verifyExistingUser.email,
                    token: accessToken,
                    userId: verifyExistingUser.id
                }
            });

            return res.status(200).json({ accessToken: accessToken, message: 'Usuário logado!' });
        } else {
            return res.status(401).json({ error: 'E-mail ou senha incorretos' });
        }

    } catch (error) {

        return res.status(500).send(error.message)

    }
}

export async function logoutUser(req: Request, res: Response) {
    const userID: number = req.body

    const sessionToDelete = await prisma.sessions.findFirst({
        where: { userId: userID }
    });

    if (sessionToDelete) {
        await prisma.sessions.delete({
            where: { id: sessionToDelete.id }
        });
        return res.status(200).send(operationSuccesfull.message)
    } else {
        return res.status(404).send('UserID not found!')
    }



}

export async function deleteAllUsers(req: Request, res: Response) {
    prisma.user.deleteMany()
    return res.status(204).send(operationSuccesfull.message)
}