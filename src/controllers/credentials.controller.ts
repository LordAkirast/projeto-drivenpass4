import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";

const prisma = new PrismaClient()


export async function createCredential(req: Request, res: Response) {
    const credentialBody = req.body as credentialBodyProtocol


    try {
        const verifyExistingCredential = await prisma.credential.findFirst({
            where: { title: credentialBody.title }
        })


        if (verifyExistingCredential) {
            return res.status(409).send(credentialAlreadyExists.message)
        }

        await prisma.credential.create({
            data: credentialBody
        })


        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}
