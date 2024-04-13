import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import healthBodyProtocol from "protocols/health.protocols";
import healthSchema from "schemas/health.schemas";


const prisma = new PrismaClient()


export function healthTest(req: Request, res: Response) {
    return res.status(200).send('OK')
}




export async function healthCreate(req: Request, res: Response) {
    const healthBody = req.body as healthBodyProtocol

    const infoVerify = prisma.test.findFirst({
        where: { email: healthBody.email }
    })



    ///middleware
    const { value, error } = healthSchema.validate(healthBody)
    if (error) {
        return res.status(422).send(error.details[0].message)
    }
    ///middleware


    try {
        const result = await prisma.test.create({
            data: healthBody
        })
        return res.status(201).send('Created!')

    } catch (error) {
        return res.status(500).send(error)
    }

}

export default healthTest;