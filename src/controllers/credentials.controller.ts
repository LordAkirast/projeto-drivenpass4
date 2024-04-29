import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";

const prisma = new PrismaClient()


export async function createCredential(req: Request, res: Response) {
    const credentialBody = req.body as credentialBodyProtocol

    const token = localStorage.getItem('accessToken');

    // Verifica se o token está presente
    if (!token) {
        return res.status(401).json({ error: 'Token is missing in localStorage' });
    }


    try {
        const verifyExistingCredential = await prisma.credential.findFirst({
            where: { title: credentialBody.title }
        })


        if (verifyExistingCredential) {
            return res.status(409).send(credentialAlreadyExists.message)
        }

        await prisma.credential.create({
            data: credentialBody
        })


        return res.status(201).send(operationSuccesfull.message)
    } catch (error) {

        return res.status(500).send(error.message)

    }
}


///nas credentials, temos que primeiro garantir que o userID é do usuário logado
///talvez salvar em localStorage?
//alias... temos que enviar username, password title,url, username,password,userId.
///cria uma tabela de sessions onde você vai guardar os usuários logados e o token.
///através do token vamos pegar o userID e colocar na credential