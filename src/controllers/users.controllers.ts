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
////como usar corretamente o throw
///ambientes de produção
///authorization
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
    const {authorization} = req.headers
    ////verifica na sessions se o token existe la
    /// quando fazer o middleware, depois da requisição na session para pegar o token
    /// no middleware colocar req.banana e ai dá de retornar isso no login por exemplo token: req.banana


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

            ls.set<string>('accessToken', accessToken);
            ///isso salva o token na accessToken para pegar ele de volta tem que usar
            ///const token = ls.get<string>('accessToken'); ai o token é salvo em token.

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
    const token: string = ls.get<string>('accessToken')

    if (!token) {
        return res.status(401).send('User is not logged to be able to logout.')
    }

    const sessionToDelete = await prisma.sessions.findFirst({
        where: { token: token }
    });

    if (sessionToDelete) {
        await prisma.sessions.delete({
            where: { id: sessionToDelete.id }
        });
        ls.clear(); ///limpa o localStorage
        return res.status(202).send(operationSuccesfull.message)
    } else {
        return res.status(401).send('User is not logged')
    }



}

export async function deleteAllUsers(req: Request, res: Response) {
    prisma.user.deleteMany()
    return res.status(204).send(operationSuccesfull.message)
}