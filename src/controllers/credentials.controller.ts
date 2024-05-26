import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import * as ls from "local-storage";

const prisma = new PrismaClient()


export async function createCredential(req: Request, res: Response) {
    const credentialBody = req.body as credentialBodyProtocol

    const user : userSessionBodyProtocol = res.locals.users
    const userToken = user.token

    const userData = await prisma.sessions.findFirst({
        where: { token: userToken }
    })

    if (!userData) {
        return res.status(401).json({error: 'Token not found on sessions.'})
    }

    try {

        const credentialData = {
            ...credentialBody,
            userId: userData.userId
        };

        const verifyExistingCredential = await prisma.credential.findFirst({
            where: { title: credentialBody.title, userId: userData.userId }
        })


        if (verifyExistingCredential) {
            return res.status(409).send(credentialAlreadyExists.message)
        }

        await prisma.credential.create({
            data: credentialData
        })


        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

export async function getCredentials(req: Request, res: Response) {
    
    const user : userSessionBodyProtocol = res.locals.users
    const userToken = user.token

    

    const userData = await prisma.sessions.findFirst({
        where: { token: userToken }
    })

    if (!userData) {
        return res.status(401).json({error: 'Token not found on sessions.'})
    }

    const myCredentials = await prisma.credential.findMany({
        where: { userId: userData.userId }
    })

    try {

        return res.status(200).send(myCredentials)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

