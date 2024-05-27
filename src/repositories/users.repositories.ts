import { PrismaClient, User } from "@prisma/client";
import { userBodyProtocol } from "../protocols/users.protocols";

const prisma = new PrismaClient()


///não entendi o type em promise

export async function getUserRepository(userBody: userBodyProtocol): Promise<User | null> {
    console.log('entrou na getUserRepository')

    const verifyExistingUser = await prisma.user.findFirst({
        where: { email: userBody.email }
    })
    
    console.log('VerifyExistingUser: ', verifyExistingUser)
    return verifyExistingUser
}

export async function createUserRepository(userBody: userBodyProtocol, hashedPassword): Promise<User | null> {

    console.log('entrou na createUserRepository')
    console.log('data: ', hashedPassword, userBody)
    return await prisma.user.create({
        data: {
            email: userBody.email,
            password: hashedPassword
        }
    });
}