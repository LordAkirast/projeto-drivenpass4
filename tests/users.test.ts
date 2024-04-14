import app from '../src/app'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'
import { usersBodyMock } from './mocks/mockCreate';

const prisma = new PrismaClient()

beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "Test" RESTART IDENTITY` //it will resets ids from test to 1
})

afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "Test" RESTART IDENTITY` //it will resets ids from test to 1
})


describe('/POST Create - Users', () => {
    it('001 - Create: Given a valid body, it shall create an user and return 201', async () => {
        const result = await supertest(app).post("/users/create").send(usersBodyMock);
        const status = result.status;

        expect(status).toBe(201)
    })

    it('Automatic Check - 001: Verify if user was created on 001', async () => {

        const findCreatedUser = await prisma.test.findFirst({
            where: { id: 1 }
        })

        expect(findCreatedUser.email).toBe(usersBodyMock.email)

    })
})