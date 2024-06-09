import { PrismaClient, Sessions, User } from "@prisma/client";
import { userBodyProtocol } from "../protocols/users.protocols";

const prisma = new PrismaClient()


///não entendi o type em promise

export async function getUserRepository(userBody: userBodyProtocol): Promise<User | null> {
   console.log('0003 - entrou na getUserRepository')
   console.log(userBody.email)

   const verifyAllUsers = await prisma.user.findMany()
    const verifyExistingUser = await prisma.user.findFirst({
        where: { email: userBody.email }
    })


    console.log(verifyAllUsers)
    if (verifyExistingUser) {
        console.log('Se isso é rota de criar usuário, deu erro pois o usuário já existe')
        console.log(verifyExistingUser)
    } else {
        console.log('Usuário não existe')
    }
    

    console.log('0004 - passou da verifyExistingUser dentro da getUserRepository')
    

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
   console.log('008 - Entrou na getSessionsRepository')

    const verifyLoggedUser = await prisma.sessions.findFirst({
        where: { email: userBody.email }
    })

    console.log('009 - Verificou se usuário está logado na getSessionsRepository')
    
    return verifyLoggedUser
}

export async function createSessionRepository(verifyExistingUser, accessToken): Promise<Sessions | null> {

    console.log('014 - Entrou na createSessionRepository')
    const session = await prisma.sessions.create({
        data: {
            email: verifyExistingUser.email,
            token: accessToken,
            userId: verifyExistingUser.id
        }
    });


    return session
}