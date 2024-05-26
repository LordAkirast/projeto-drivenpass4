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