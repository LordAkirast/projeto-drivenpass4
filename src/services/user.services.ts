import { getUserRepository, createUserRepository, getSessionsRepository, createSessionRepository } from "../repositories/users.repositories";
import { userBodyProtocol } from "../protocols/users.protocols";
import { PrismaClient, User, Sessions } from "@prisma/client";
import { EmailAlreadyExists } from "../middlewares/errors.middleware";
import { v4 as uuid } from 'uuid';
import bcrypt from "bcrypt";
import { WrongDataError, ConflictError, InternalServerError } from "../errors/errorMessages";


export async function createUserService(userBody: userBodyProtocol, hashedPassword): Promise<User> {

    const verifyExistingUser = await getUserRepository(userBody);

    ///não sei como retornar status error code aqui
    if (verifyExistingUser) {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAA')
        throw new ConflictError('Email already exists');
    }

    const newUser = await createUserRepository(userBody, hashedPassword);
    return newUser;
}

export async function loginUserService(userBody: userBodyProtocol, hashedPassword): Promise<Sessions> {

    ///verifica se o usuário já existe
    const verifyExistingUser = await getUserRepository(userBody);

    if (verifyExistingUser == null) {
        throw new WrongDataError('E-mail ou senha incorretos');
    }

    //verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(userBody.password, verifyExistingUser.password);

    if (!passwordMatch) {
        throw new WrongDataError('E-mail ou senha incorretos');
    }

    ///verifica se o usuário já está logado
    const verifyLoggedUser = await getSessionsRepository(userBody, hashedPassword)

    if (verifyLoggedUser) {
        throw new ConflictError('User is already logged.');
    }
   
    ///se o usuário de fato existir, cria o token
    if (verifyExistingUser) {
        const accessToken = uuid();

        ///cria a sessão do usuário
        const createSession = await createSessionRepository(verifyExistingUser, accessToken)
        return createSession;

    } else {
        throw new InternalServerError('Something went wrong with the server');
    }
}