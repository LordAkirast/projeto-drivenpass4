import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import { getCredentialByIDService, createCredentialService, getCredentialService, deleteCredentialByIDService } from "../services/credential.services";
import { NotFoundError, ConflictError, WrongDataError, UnauthorizedError, BadRequestError } from "../errors/errorMessages";
import handleError from "./handleErrors.controller";
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
        handleError(res, error)
    }
}

export async function getCredentials(req: Request, res: Response) {

    const user: userSessionBodyProtocol = res.locals.users
    const userToken = user.token

    try {
        const myCredentials = await getCredentialService(user)

        return res.status(200).send(myCredentials)
    } catch (error) {
        handleError(res, error)
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
        handleError(res, error)
    }
}

export async function deleteCredentialByID(req: Request, res: Response) {
    try {

        const { id } = req.params;
        const user: userSessionBodyProtocol = res.locals.users
        const userToken = user.token

        const deleteCredential = await deleteCredentialByIDService(id, user)

        return res.status(200).json({'Deletion Complete' : deleteCredential})
    } catch (error) {
        handleError(res, error)
    }
}

