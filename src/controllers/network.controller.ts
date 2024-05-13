import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { networkBodyProtocol } from "../protocols/network.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";
import * as ls from "local-storage";

const prisma = new PrismaClient()


export async function createNetwork(req: Request, res: Response) {
    const networkBody = req.body as networkBodyProtocol

    const token = ls.get<string>('accessToken');

   
    if (!token) {
        return res.status(401).json({ error: 'Token is missing in localStorage' });
    }

    const userData = await prisma.sessions.findFirst({
        where: {token: token}
    })

    try {

        const networkData = {
            ...networkBody,
            userId: userData.userId 
        };


        await prisma.network.create({
            data: networkData
        })


        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

export async function getCredentials(req: Request, res: Response) {

    const token = ls.get<string>('accessToken');

   
    if (!token) {
        return res.status(401).json({ error: 'Token is missing in localStorage' });
    }

    const userData = await prisma.sessions.findFirst({
        where: {token: token}
    })

    const myCredentials = await prisma.credential.findMany({
        where: {userId: userData.userId}
    })

    try {

        return res.status(200).send(myCredentials)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

