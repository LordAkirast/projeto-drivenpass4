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

////tá dando erro de authorization na rota de logout. 
///provavelmente o token não está sendo enviado ou lido
///verifique o erro

export async function createUser(req: Request, res: Response) {
    const userBody = req.body as userBodyProtocol

    try {

        const hashedPassword = await bcrypt.hash(userBody.password, 10);
        await createUserService(userBody, hashedPassword)

        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {
        console.log("Error instance:", error);
        console.log("Is NotFoundError:", error instanceof NotFoundError);
        console.log("Is ConflictError:", error instanceof ConflictError);
        console.log("Is WrongDataError:", error instanceof WrongDataError);


        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else if (error instanceof ConflictError) {
            return res.status(409).json({ error: error.message });
        } else if (error instanceof WrongDataError) {
            return res.status(401).json({ error: error.message });
        } else {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export async function loginUser(req: Request, res: Response,) {
    const userBody = req.body as userBodyProtocol

    try {
        const hashedPassword = await bcrypt.hash(userBody.password, 10);
        console.log('USERBODY E HASHEEEEEEDDDD', userBody.password, hashedPassword)
        ///como retornar o token de dentro da service?
        await loginUserService(userBody, hashedPassword)

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
    try {
        await prisma.sessions.deleteMany()
        await prisma.credential.deleteMany()
        await prisma.network.deleteMany()
        await prisma.user.deleteMany()
        
        return res.status(204).send(operationSuccesfull.message)
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error)
    }

}

export async function getAllUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany()
    return res.status(200).send(users)
}