import { getUserRepository, createUserRepository } from "../repositories/users.repositories";
import { userBodyProtocol } from "../protocols/users.protocols";
import { PrismaClient, User } from "@prisma/client";
import { EmailAlreadyExists } from "../middlewares/errors.middleware";
import bcrypt from "bcrypt";


export async function createUserService(userBody: userBodyProtocol, hashedPassword): Promise<User> {

    const verifyExistingUser = await getUserRepository(userBody);

    ///não sei como retornar status error code aqui
    if (verifyExistingUser) {
        throw new Error(EmailAlreadyExists.message);
    }

    const newUser = await createUserRepository(userBody, hashedPassword);
    return newUser;
}

export async function loginUserService(userBody: userBodyProtocol, hashedPassword): Promise<User> {

    const verifyExistingUser = await getUserRepository(userBody);

    ///não sei como retornar status error code aqui
    if (!verifyExistingUser) {
        throw new Error('401: E-mail ou senha incorretos');
    }

    const passwordMatch = await bcrypt.compare(userBody.password, verifyExistingUser.password);

    if (!passwordMatch) {
        throw new Error('401: E-mail ou senha incorretos');
    }

    const newUser = await createUserRepository(userBody, hashedPassword);
    return newUser;
}