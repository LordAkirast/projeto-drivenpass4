import app from '../src/app'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'
import { usersBodyMock } from './mocks/mockCreate';

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
    it('001 - Login: Given a valid body, and a correct user email and password existing on the database it shall and return 200', async () => {

        prisma.user.create({
            data: usersBodyMock
        })

        const result = await supertest(app).post("/users/login").send(usersBodyMock);
        const status = result.status;

        expect(status).toBe(200)
    })
})