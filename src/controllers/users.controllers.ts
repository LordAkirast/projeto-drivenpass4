import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userBodyProtocol } from "../protocols/users.protocols";
import { EmailAlreadyExists, generalServerError, unauthorizedError } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { usersSchema } from "../schemas/users.schemas";
import { v4 as uuid } from 'uuid';
import * as ls from "local-storage";
import bcrypt from "bcrypt";
import { getCredentials } from "./credentials.controller";

const prisma = new PrismaClient()

////o que eu não sei
///ambientes de produção
///separar em services e repositories

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

        const hashedPassword = await bcrypt.hash(userBody.password, 10);

        await prisma.user.create({
            data: {
                email: userBody.email,
                password: hashedPassword
            }
        });

        // console.log(hashedPassword)


        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

export async function loginUser(req: Request, res: Response,) {
    const userBody = req.body as userBodyProtocol

    try {

        const verifyExistingUser = await prisma.user.findFirst({
            where: { email: userBody.email }
        })

        if (!verifyExistingUser) {
            return res.status(401).send('E-mail ou senha incorretos');
        }

        // Compara a senha fornecida com a senha hash armazenada no banco de dados
        const passwordMatch = await bcrypt.compare(userBody.password, verifyExistingUser.password);

        if (!passwordMatch) {
            return res.status(401).send('E-mail ou senha incorretos');
        }

        const verifyLoggedUser = await prisma.sessions.findFirst({
            where: { email: userBody.email }
        })

        if (verifyLoggedUser) {
            return res.status(409).send('User is already logged.')
        }

        if (verifyExistingUser) {
            const accessToken = uuid();

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
    ////não sei como não precisar repetir
    const { authorization } = req.headers

    const userToken = authorization.split(' ')[1]

    const userData = await prisma.sessions.findFirst({
        where: { token: userToken }
    })

    if (!userData) {
        return res.status(401).json({error: 'Token not found on sessions.'})
    }

    await prisma.sessions.delete({
        where: { id: userData.id }
    });

    return res.status(202).send(operationSuccesfull.message)

}

export async function deleteAllUsers(req: Request, res: Response) {
    prisma.user.deleteMany()
    return res.status(204).send(operationSuccesfull.message)
}