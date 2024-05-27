import { PrismaClient, User } from "@prisma/client";
import { userBodyProtocol } from "../protocols/users.protocols";

const prisma = new PrismaClient()


///não entendi o type em promise

export async function getUserRepository(userBody: userBodyProtocol): Promise<User | null> {
   

    const verifyExistingUser = await prisma.user.findFirst({
        where: { email: userBody.email }
    })
    

    return verifyExistingUser
}

export async function createUserRepository(userBody: userBodyProtocol, hashedPassword): Promise<User | null> {

    return await prisma.user.create({
        data: {
            email: userBody.email,
            password: hashedPassword
        }
    });
}

export async function getSessionsRepository(userBody: userBodyProtocol, hashedPassword): Promise<User | null> {
   

    const verifyLoggedUser = await prisma.sessions.findFirst({
        where: { email: userBody.email }
    })
    
    ////não sei resolver esse erro do return
    return verifyLoggedUser
}