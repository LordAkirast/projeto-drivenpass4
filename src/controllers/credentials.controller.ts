import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";
import * as ls from "local-storage";

const prisma = new PrismaClient()


export async function createCredential(req: Request, res: Response) {
    const credentialBody = req.body as credentialBodyProtocol
    const { authorization } = req.headers

    const userToken = authorization.split('')[1]

    const userData = await prisma.sessions.findFirst({
        where: { token: userToken }
    })

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
    const { authorization } = req.headers

    const userToken = authorization.split('')[1]

    

    const userData = await prisma.sessions.findFirst({
        where: { token: userToken }
    })

    const myCredentials = await prisma.credential.findMany({
        where: { userId: userData.userId }
    })

    try {

        return res.status(200).send(myCredentials)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

