import { PrismaClient, Sessions, User, Credential } from "@prisma/client";
import { userBodyProtocol, userFindActiveSessionProtocol, userSessionBodyProtocol } from "../protocols/users.protocols";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
const prisma = new PrismaClient()



////a ideia era criar uma função que diminuisse a repetição de services.
////mas percebi que poderia ser um middleware, mas para não me perder ou dar erro aleatório, resolvi deixar para depois
export async function VerifyExistingSession(user: userSessionBodyProtocol): Promise<Sessions | null> {
    const userData = await prisma.sessions.findFirst({
        where: { token: user.token }
    })

    return userData
}