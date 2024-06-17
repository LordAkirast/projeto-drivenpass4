import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userBodyProtocol } from "../protocols/users.protocols";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { deleteAllUsersRepository, getAllUsersRepository } from "../repositories/users.repositories";
import { createUserService, loginUserService, logoutUserService } from "../services/user.services";
import { NotFoundError, ConflictError, WrongDataError, BadRequestError, UnauthorizedError } from "../errors/errorMessages";
import handleError from "./handleErrors.controller";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

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
        console.log("Error instance:", error);
        console.log("Is BadRequestError:", error instanceof BadRequestError);
        console.log("Is UnauthorizedError:", error instanceof UnauthorizedError);
        console.log("Is NotFoundError:", error instanceof NotFoundError);
        console.log("Is ConflictError:", error instanceof ConflictError);
        console.log("Is WrongDataError:", error instanceof WrongDataError);


        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else if (error instanceof ConflictError) {
            return res.status(409).json({ error: error.message });
        } else if (error instanceof WrongDataError) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof UnauthorizedError) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof BadRequestError) {
            return res.status(401).json({ error: error.message });
        } else {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export async function logoutUser(req: Request, res: Response) {
    const users = res.locals.users
    const userToken = users.token


    try {
        await logoutUserService(users, userToken)
        return res.status(202).send(operationSuccesfull.message)

    } catch (error) {
        console.log("Error instance:", error);
        console.log("Is BadRequestError:", error instanceof BadRequestError);
        console.log("Is UnauthorizedError:", error instanceof UnauthorizedError);
        console.log("Is NotFoundError:", error instanceof NotFoundError);
        console.log("Is ConflictError:", error instanceof ConflictError);
        console.log("Is WrongDataError:", error instanceof WrongDataError);


        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else if (error instanceof ConflictError) {
            return res.status(409).json({ error: error.message });
        } else if (error instanceof WrongDataError) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof UnauthorizedError) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof BadRequestError) {
            return res.status(401).json({ error: error.message });
        } else {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }


}

export async function deleteAllUsers(req: Request, res: Response) {
    try {

        await deleteAllUsersRepository()

        return res.status(204).send(operationSuccesfull.message)
    } catch (error) {
        console.log("Error instance:", error);
        console.log("Is BadRequestError:", error instanceof BadRequestError);
        console.log("Is UnauthorizedError:", error instanceof UnauthorizedError);
        console.log("Is NotFoundError:", error instanceof NotFoundError);
        console.log("Is ConflictError:", error instanceof ConflictError);
        console.log("Is WrongDataError:", error instanceof WrongDataError);


        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        } else if (error instanceof ConflictError) {
            return res.status(409).json({ error: error.message });
        } else if (error instanceof WrongDataError) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof UnauthorizedError) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof BadRequestError) {
            return res.status(401).json({ error: error.message });
        } else {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

}

export async function getAllUsers(req: Request, res: Response) {
    const users = await getAllUsersRepository()
    return res.status(200).send(users)
}