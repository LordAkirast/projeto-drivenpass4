import { PrismaClient, Sessions, User, Credential } from "@prisma/client";
import { userBodyProtocol, userFindActiveSessionProtocol, userSessionBodyProtocol } from "../protocols/users.protocols";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
const prisma = new PrismaClient()

export async function createCredentialRepository(credentialData): Promise<Credential | null> {

    return await prisma.credential.create({
        data: credentialData
    })
    
}

export async function getSessionsCredentialsRepository(user: userSessionBodyProtocol): Promise<Sessions | null> {

    const userData = await prisma.sessions.findFirst({
        where: { token: user.token }
    })

    return userData
}



/////aqui tem que usar esse Promise<Credential[]> pois retorna um array de objetos. em findMany ele retorna um array
export async function getAllCredentialRepository(user : userSessionBodyProtocol, userData): Promise<Credential[]> {

    const myCredentials = await prisma.credential.findMany({
        where: { userId: userData.userId }
    })

    return myCredentials
}

export async function getUniqueCredentialRepository(id, userData): Promise<Credential | null> {

    const credentialByID = await prisma.credential.findUnique({
        where: { userId: userData.userId, id: Number(id) }
    })

    return credentialByID
}

export async function verifyExistingCredentialRepository(credentialBody : credentialBodyProtocol, userData): Promise<Credential | null> {

    const verifyExistingCredential = await prisma.credential.findFirst({
        where: { title: credentialBody.title, userId: userData.userId }
    })

    console.log('02 - VerifyExistingCredenital: ', verifyExistingCredential)
    

    return verifyExistingCredential

}
