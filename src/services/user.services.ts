import { getUserRepository, createUserRepository } from "../repositories/users.repositories";
import { userBodyProtocol } from "../protocols/users.protocols";
import { PrismaClient, User } from "@prisma/client";
import { EmailAlreadyExists } from "../middlewares/errors.middleware";


export async function createUserService(userBody: userBodyProtocol, hashedPassword): Promise<User> {
    console.log('entrou na createUserService')

    console.log(userBody, hashedPassword)
    const verifyExistingUser = await getUserRepository(userBody);
    console.log('VerifyExistingUser na service: ',verifyExistingUser)

    if (verifyExistingUser) {
        console.log('verifyExistingUser tem valor: ', verifyExistingUser)
        throw new Error(EmailAlreadyExists.message);
    }

    const newUser = await createUserRepository(userBody, hashedPassword);
    console.log('newUser: ', newUser)
    return newUser;
}