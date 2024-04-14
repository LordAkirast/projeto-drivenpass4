import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userBodyProtocol } from "../protocols/users.protocols";

const prisma = new PrismaClient()



async function createUser(req: Request, res: Response) {
    const userBody = req.body as userBodyProtocol

    try {
        const verifyExistingUser = await prisma.user.findFirst({
            where: {email: userBody.email}
        })

        if (verifyExistingUser) {
            return 
        }
    } catch (error) {
        
    }
}