import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import * as ls from "local-storage";
import { getSessionsCredentialsRepository, verifyExistingCredentialRepository, createCredentialRepository } from "../repositories/credentials.repositories";
import { NotFoundError, ConflictError } from "../errors/errorMessages";


export async function getCredentialByIDService(id, user) {

}


export async function createCredentialService(user: userSessionBodyProtocol, credentialBody: credentialBodyProtocol, hashedPassword) {

    const userData = await getSessionsCredentialsRepository(user)

    if (!userData) {
        throw new NotFoundError('User session not found. User is not logged.')
    }

    const credentialData = {
        title: credentialBody.title,
        url: credentialBody.url,
        username: credentialBody.username,
        password: hashedPassword,
        userId: userData.id
    };

    const verifyExistingCredential = await verifyExistingCredentialRepository(credentialBody, userData)

    
    if (verifyExistingCredential) {
        throw new NotFoundError(credentialAlreadyExists.message)
    }

    await createCredentialRepository(credentialData)

}