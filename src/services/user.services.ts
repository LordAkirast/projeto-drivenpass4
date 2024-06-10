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

    console.log(userBody.email, verifyExistingUser.email)

    //verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(userBody.password, verifyExistingUser.password);
    console.log('005 - Verificou se senha está correta')

    if (!passwordMatch) {
        throw new WrongDataError('E-mail ou senha incorretos');
    }

    console.log('006 - Passou da verificação se senha está correta')


    ///verifica se o usuário já está logado
    console.log('007 - verifica se o usuário já está logado')
    const verifyLoggedUser = await getSessionsRepository(userBody, hashedPassword)

    if (verifyLoggedUser) {
        throw new ConflictError('User is already logged.');
    }
    console.log('010 - verificou que o usuário já está logado')


    ///se o usuário de fato existir, cria o token
    if (verifyExistingUser) {
        const accessToken = uuid();

        console.log('011 - Criou o Token')
        console.log('012 - DataCHeck', userBody, hashedPassword, accessToken)



        ///cria a sessão do usuário
        console.log('013 - Tenta criar sessão do usuário')
        const createSession = await createSessionRepository(verifyExistingUser, accessToken)

        console.log('015 - Saiu da createSessionRepository')
        console.log(createSession)
        return createSession;

    } else {
        throw new InternalServerError('Something went wrong with the server');
    }
}