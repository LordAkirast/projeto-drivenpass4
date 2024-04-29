import app from '../src/app'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'
import { usersBodyMock, usersLoginBodyMock } from './mocks/mockCreate';
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
        const result = await supertest(app).post("/credentials/create").send(usersBodyMock);
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
