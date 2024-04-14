import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userBodyProtocol } from "../protocols/users.protocols";
import { EmailAlreadyExists, generalServerError } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { usersSchema } from "../schemas/users.schemas";

const prisma = new PrismaClient()



export async function createUser(req: Request, res: Response) {
    const userBody = req.body as userBodyProtocol


    try {
        const verifyExistingUser = await prisma.user.findFirst({
            where: { email: userBody.email }
        })


        if (verifyExistingUser) {
            console.log('verifyExistingUser tem valor: ',verifyExistingUser)
            return res.status(409).send(EmailAlreadyExists.message)
        }

        await prisma.user.create({
            data: userBody
        })


        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}

export async function deleteAllUsers(req: Request, res: Response) {
    prisma.user.deleteMany()
    return res.status(204).send(operationSuccesfull.message)
}