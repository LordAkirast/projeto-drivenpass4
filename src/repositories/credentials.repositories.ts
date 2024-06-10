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

export async function verifyExistingCredentialRepository(credentialBody, userData) {

    const verifyExistingCredential = await prisma.credential.findFirst({
        where: { title: credentialBody.title, userId: userData.userId }
    })
    

    return verifyExistingCredential

}
