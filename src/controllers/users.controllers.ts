import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import handleError from "./handleErrors.controller";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { userBodyProtocol } from "../protocols/users.protocols";
import { deleteAllUsersRepository, getAllUsersRepository } from "../repositories/users.repositories";
import { createUserService, loginUserService, logoutUserService } from "../services/user.services";
import bcrypt from "bcrypt";


const prisma = new PrismaClient()

///o que fazer?
//// criar testes para todas as rotas - 1h30





export async function createUser(req: Request, res: Response) {
    const userBody = req.body as userBodyProtocol

    try {
        const successMessage = operationSuccesfull.message
        const hashedPassword = await bcrypt.hash(userBody.password, 10);
        const createUser = await createUserService(userBody, hashedPassword)

        const userCreatedDataForMessage = {
            id: createUser.id,
            email: createUser.email,
            password: createUser.password
        }
        return res.status(201).json({
            message: successMessage,
            user: userCreatedDataForMessage
        })
    } catch (error) {
        handleError(res, error)
    }
}

export async function loginUser(req: Request, res: Response,) {
    const userBody = req.body as userBodyProtocol

    try {
        const hashedPassword = await bcrypt.hash(userBody.password, 10);
        const createSession = await loginUserService(userBody, hashedPassword);

        return res.status(200).json({ message: 'Usuário logado!', token: createSession.token });
    }
    catch (error) {
        handleError(res, error)
    }
}

export async function logoutUser(req: Request, res: Response) {
    const users = res.locals.users
    const userToken = users.token


    try {
        await logoutUserService(users, userToken)
        return res.status(202).send(operationSuccesfull.message)

    } catch (error) {
        handleError(res, error)
    }


}

export async function deleteAllUsers(req: Request, res: Response) {
    try {

        await deleteAllUsersRepository()

        return res.status(204).send(operationSuccesfull.message)
    } catch (error) {
        handleError(res, error)
    }

}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const users = await getAllUsersRepository()
        return res.status(200).send(users)

    } catch (error) {
        handleError(res, error)

    }

}