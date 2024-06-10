import { PrismaClient, Sessions, User } from "@prisma/client";
import { userBodyProtocol } from "../protocols/users.protocols";

const prisma = new PrismaClient()


///não entendi o type em promise

export async function getUserRepository(userBody: userBodyProtocol): Promise<User | null> {

    const verifyAllUsers = await prisma.user.findMany()
    const verifyExistingUser = await prisma.user.findFirst({
        where: { email: userBody.email }
    })

    if (verifyExistingUser) {
        console.log('Se isso é rota de criar usuário, deu erro pois o usuário já existe')
        console.log(verifyExistingUser)
    } else {
        console.log('Usuário não existe')
    }

    return verifyExistingUser
}

export async function createUserRepository(userBody: userBodyProtocol, hashedPassword): Promise<User | null> {
    console.log('criou')
    return await prisma.user.create({
        data: {
            email: userBody.email,
            password: hashedPassword
        }
    });
}

export async function getSessionsRepository(userBody: userBodyProtocol, hashedPassword): Promise<Sessions | null> {
    
    const verifyLoggedUser = await prisma.sessions.findFirst({
        where: { email: userBody.email }
    })

    return verifyLoggedUser
}

export async function createSessionRepository(verifyExistingUser, accessToken): Promise<Sessions | null> {

    const session = await prisma.sessions.create({
        data: {
            email: verifyExistingUser.email,
            token: accessToken,
            userId: verifyExistingUser.id
        }
    });


    return session
}