import app from '../src/app'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'
import { usersBodyMock, usersLoginBodyMock, credentialBodyMock } from './mocks/mockCreate';
import * as ls from "local-storage";

const prisma = new PrismaClient();

beforeAll(async () => {
    try {
        await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    } catch (error) {
        console.error('Erro ao truncar tabelas:', error);
    }
});

afterAll(async () => {
    try {
        await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    } catch (error) {
        console.error('Erro ao truncar tabelas:', error);
    }
});


describe('/POST Create - Credentials', () => {
    it('001 - Create: Given a valid body, it shall create a credential and return 201', async () => {

        await prisma.sessions.deleteMany({
            where: {} 
        });

        await prisma.user.deleteMany({
            where: {}
          });

        await prisma.user.create({
            data: usersBodyMock
        })

        const verification = await prisma.user.findFirst({
            where: { email: usersBodyMock.email, password: usersBodyMock.password }
        })

        if (!verification) {
            throw new Error("User wasn't found on the database. The test can't continue.");
        }

       const userSession = await prisma.sessions.create({
            data: {
                email: usersBodyMock.email,
                token: 'testlogout',
                userId: verification.id
            } 
        })

        const verificationSessions = await prisma.sessions.findFirst({
            where: { email: usersBodyMock.email }
        })

        if (!verificationSessions) {
            throw new Error("User session was not found. The test can't continue.");
        }

        const token = userSession.token

        const result = await supertest(app).post("/credential/create").set('Authorization', `Bearer ${token}`).send(credentialBodyMock);
        const status = result.status;

        const findCreatedCredential = await prisma.credential.findFirst({
            where: { userId: verification.id }
        })

        if (!findCreatedCredential) {
            throw new Error("User credential was not found. The test can't continue.");
        }

        expect(status).toBe(201)
    })
})

describe('/GET Read - Credentials', () => {
    it('001 - Read: If an user exits, it has credentials and a valid token, it shall return all credentials whose owner is the user and return 200', async () => {

        await prisma.sessions.deleteMany({
            where: {} 
        });

        await prisma.credential.deleteMany({
            where: {}
          });

        await prisma.user.deleteMany({
            where: {}
          });

        await prisma.user.create({
            data: usersBodyMock
        })

        const verification = await prisma.user.findFirst({
            where: { email: usersBodyMock.email, password: usersBodyMock.password }
        })

        if (!verification) {
            throw new Error("User wasn't found on the database. The test can't continue.");
        }

        const userSession = await prisma.sessions.create({
            data: {
                email: usersBodyMock.email,
                token: 'testlogout',
                userId: verification.id
            } 
        })

        const verificationSessions = await prisma.sessions.findFirst({
            where: { email: usersBodyMock.email }
        })

        if (!verificationSessions) {
            throw new Error("User session was not found. The test can't continue.");
        }

        const token = userSession.token


        aprendi a fazer a relação de uma tabela com outra via teste
        await prisma.credential.create({
            data: {
                    title: credentialBodyMock.title,
                    url: credentialBodyMock.url,
                    username: verification.email,
                    password: verification.password,
                    user: {
                        connect: { id: verification.id }  Conectando a credencial ao usuário existente
                    }
            } 
        })


        

        const result = await supertest(app).post("/credential/create").set('Authorization', `Bearer ${token}`).send(credentialBodyMock);
        const status = result.status;

        const result2 = await supertest(app).get("/credential/read").set('Authorization', `Bearer ${token}`);
        const status2 = result2.status;


        const findCreatedCredential = await prisma.credential.findMany({
            where: { userId: verification.id }
        })

        if (!result2) {
            throw new Error("User credentials was not found. The test can't continue.");
        }

        expect(status2).toBe(200)
    })
})
