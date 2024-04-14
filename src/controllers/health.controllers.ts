import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { healthSchema, healthEmailSchema, healthUpdateSchema, healthIdSchema } from "../schemas/health.schemas";
import { healthBodyProtocol, idProtocol, healthEmailProtocol } from "../protocols/health.protocols";


const prisma = new PrismaClient()


export function healthTest(req: Request, res: Response) {
    return res.status(200).send('OK')
}


export async function healthCreate(req: Request, res: Response) {
    const healthBody = req.body as healthBodyProtocol

    console.log("Verificando se healthBody é undefined:", healthBody === undefined);
    if (healthBody === undefined) {
        console.log("healthBody é undefined. Retornando status 422...");
        return res.status(422).send('Unprocessable Entity');
    }

    try {
        ///middleware
        const { value, error } = healthSchema.validate(healthBody)

        if (error) {

            return res.status(422).send(error.details[0].message)
        }
        ///middleware

        const infoVerify = await prisma.test.findUnique({
            where: { email: healthBody.email }
        })

        if (infoVerify && infoVerify.email === healthBody.email) {
            res.status(409).send('Erro: Já existe um usuário com este endereço de e-mail.')
        }


        const result = await prisma.test.create({
            data: healthBody
        })

        return res.status(201).send('Created!')

    } catch (error) {

        return res.status(500).send(error)
    }

}

export async function healthRead(req: Request, res: Response) {

    try {
        const findHealth = prisma.test.findMany()
        return res.status(200).send(findHealth)

    } catch (error) {
        return res.status(500).send(error)
    }

}

export async function healthReadByEmail(req: Request, res: Response) {
    const healthEmail = req.params.email

    try {
        const findHealthByEmail = await prisma.test.findFirst({
            where: { email: healthEmail }
        })

        if (!findHealthByEmail) {
            return res.status(404).send('This e-mail does not exist.')
        } else {
            return res.status(200).send(findHealthByEmail)
        }

    } catch (error) {
        return res.status(500).send(error)
    }

}

export async function healthUpdate(req: Request, res: Response) {
    const healthBody = req.body as healthBodyProtocol


    ///middleware
    const { value, error } = healthUpdateSchema.validate(healthBody)
    if (error) {
        return res.status(422).send(error.details[0].message)
    }
    ///middleware


    try {

        const infoVerify = await prisma.test.findFirst({
            where: { id: healthBody.id }
        })

        if (!infoVerify) {
            return res.status(404).send('ID not found!')
        }

        await prisma.test.update({
            where: { id: healthBody.id },
            data: healthBody
        })
        return res.status(204).send('User Updated!')

    } catch (error) {
        return res.status(500).send(error)
    }

}

export async function healthDelete(req: Request, res: Response) {
    const healthId = req.body as idProtocol

    ///middleware
    const { value, error } = healthIdSchema.validate(healthId)
    if (error) {
        return res.status(422).send(error.details[0].message)
    }
    ///middleware


    try {
        const deleteHealthById = await prisma.test.delete({
            where: { id: healthId.id }
        })

        if (deleteHealthById) {
            return res.status(200).send(deleteHealthById)
        } else {
            throw new Error('There is no user with this ID');
        }

    } catch (error) {
        return res.status(500).send(error)
    }

}

export default healthTest;