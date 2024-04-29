import app from '../src/app'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'
import { usersBodyMock, usersLoginBodyMock } from './mocks/mockCreate';

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


describe('/POST Create - Users', () => {
    it('001 - Create: Given a valid body, it shall create an user and return 201', async () => {
        const result = await supertest(app).post("/users/create").send(usersBodyMock);
        const status = result.status;

        expect(status).toBe(201)
    })

    it('Automatic Check - 001: Verify if user was created on 001', async () => {

        const findCreatedUser = await prisma.user.findFirst({
            where: { id: 1 }
        })

        expect(findCreatedUser.email).toBe(usersBodyMock.email)

    })
})

describe('/POST Login - Users', () => {
    it('001 - Login: Given a valid body, and a correct user email and password existing on the database it shall create a data on user session and return 200', async () => {

        prisma.user.create({
            data: usersBodyMock
        })

        const verification = prisma.user.findFirst({
            where: { email: usersBodyMock.email, password: usersBodyMock.password }
        })

        const verificationSessions = prisma.sessions.findFirst({
            where: { email: usersBodyMock.email}
        })

        if (!verification) {
            throw new Error("User wasn't found on the database. The test can't continue.");
        }

        if (!verificationSessions) {
            throw new Error("User session was not found. The test can't continue.");
        }

        const result = await supertest(app).post("/users/login").send(usersBodyMock);
        const status = result.status;

        expect(status).toBe(200)
    })

    it('002 - Login: Given a valid body, and an incorrect user email and password non-existing on the database it shall and return 401', async () => {

        prisma.user.create({
            data: usersBodyMock
        })

        const result = await supertest(app).post("/users/login").send(usersLoginBodyMock);
        const status = result.status;

        expect(status).toBe(401)
    })
    
})

describe('/POST Logout - Users', () => {
    it('001 - Logout: Given a valid userID from an user that exists on the sessions table it shall delete the user from sessions and return 202', async () => {

        await prisma.user.create({
            data: usersBodyMock
        })

        const verification = await prisma.user.findFirst({
            where: { email: usersBodyMock.email, password: usersBodyMock.password }
        })

        const verificationSessions = await prisma.sessions.findFirst({
            where: { email: usersBodyMock.email}
        })

        if (!verification) {
            throw new Error("User wasn't found on the database. The test can't continue.");
        }

        if (!verificationSessions) {
            throw new Error("User session was not found. The test can't continue.");
        }

        const userLogoutData = {
            userID: verificationSessions.userId
        }

        const result = await supertest(app).post("/users/logout").send(userLogoutData);
        const status = result.status;

        expect(status).toBe(202)
    })

    it('002 - Login: Given a valid body, and an incorrect user email and password non-existing on the database it shall and return 401', async () => {

        prisma.user.create({
            data: usersBodyMock
        })

        const result = await supertest(app).post("/users/login").send(usersLoginBodyMock);
        const status = result.status;

        expect(status).toBe(401)
    })
    
})