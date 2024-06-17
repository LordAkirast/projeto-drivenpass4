import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import { getCredentialByIDService, createCredentialService, getCredentialService, deleteCredentialByIDService } from "../services/credential.services";
import { NotFoundError, ConflictError, WrongDataError, UnauthorizedError, BadRequestError } from "../errors/errorMessages";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()


export async function createCredential(req: Request, res: Response) {
    try {
        const credentialBody = req.body as credentialBodyProtocol
        const user: userSessionBodyProtocol = res.locals.users
        const userToken = user.token
        const hashedPassword = await bcrypt.hash(credentialBody.password, 10);

        await createCredentialService(user, credentialBody, hashedPassword)

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

export async function getCredentials(req: Request, res: Response) {

    const user: userSessionBodyProtocol = res.locals.users
    const userToken = user.token

    try {
        const myCredentials = await getCredentialService(user)

        return res.status(200).send(myCredentials)
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

export async function getCredentialByID(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user: userSessionBodyProtocol = res.locals.users
        const userToken = user.token


        const uniqueCredential = await getCredentialByIDService(id, user)

        return res.status(200).send(uniqueCredential)
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

export async function deleteCredentialByID(req: Request, res: Response) {
    try {

        console.log('001 - entrou')
        const { id } = req.params;
        const user: userSessionBodyProtocol = res.locals.users
        const userToken = user.token

        const deleteCredential = await deleteCredentialByIDService(id, user)

        return res.status(200).send('Deletion Complete')
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
        } else if (error instanceof UnauthorizedError) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof BadRequestError) {
            return res.status(401).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

