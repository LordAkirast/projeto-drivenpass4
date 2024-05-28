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
///repositories
import { getUserRepository, createUserRepository } from "../repositories/users.repositories";
import { createUserService, loginUserService } from "../services/user.services";
import { NotFoundError, ConflictError, WrongDataError } from "../errors/errorMessages";

const prisma = new PrismaClient()

////o que eu não sei
///ambientes de produção
///separar em services e repositories
///em repositories, não entendi a parte de promise
///não sei como retornar status error code
//// não sei como conseguir puxar informação de dentro da service para o controller de novo

export async function createUser(req: Request, res: Response) {
    const userBody = req.body as userBodyProtocol

    try {

        const hashedPassword = await bcrypt.hash(userBody.password, 10);
        await createUserService(userBody, hashedPassword)

        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

export async function loginUser(req: Request, res: Response,) {
    const userBody = req.body as userBodyProtocol

    try {
        const hashedPassword = await bcrypt.hash(userBody.password, 10);
        ///como retornar o token de dentro da service?
        await loginUserService(userBody, hashedPassword)
        console.log('terminou de rodar a loginUserService')
        console.log(loginUserService)



        return res.status(200).json({ message: 'Usuário logado!' });
    }
    catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else if (error instanceof ConflictError) {
            return res.status(409).json({ error: error.message });
        } else if (error instanceof WrongDataError) {
            return res.status(401).json({ error: error.message });
        }
        else {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export async function logoutUser(req: Request, res: Response) {
    const users = res.locals.users
    const userToken = users.token

    const userData = await prisma.sessions.findFirst({
        where: { token: userToken }
    })

    if (!userData || userData == undefined) {
        return res.status(401).json({ error: 'Token not found on sessions.' })
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