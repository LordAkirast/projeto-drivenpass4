import app from '../src/app'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'
import { healthBodyMock, healthEmailMock } from './mocks/mockCreate';

beforeAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "Test" RESTART IDENTITY` //it will resets ids from test to 1
})

afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "Test" RESTART IDENTITY` //it will resets ids from test to 1
})


const prisma = new PrismaClient()

describe('/GET Health', () => {
    it('001 - Health: it shall return 200 if the route is correct', async () => {
        const token = 'aaaa'
        const result = await supertest(app).set('Authorization', `Bearer ${token}`).post("/health")
        const status = result.status;

        expect(status).toBe(200)
    })
})

describe('/POST Create', () => {
    it('001 - Create: Given a valid body, it shall create an health and return 201', async () => {
        const result = await supertest(app).post("/health/create").send(healthBodyMock);
        const status = result.status;

        expect(status).toBe(201)
    })

    it('Automatic Check - 001: Verify if user was created on 001', async () => {

        const findCreatedHealth = await prisma.test.findFirst({
            where: { id: 1 }
        })

        expect(findCreatedHealth.email).toBe(healthBodyMock.email)

    })
})

describe('/GET Read', () => {

    it('001 - Read: it shall return 200', async () => {

        const result = await supertest(app).get(`/health/read`);
        const status = result.status

        expect(status).toBe(200)
    })

    it('002 - Read: Given a valid email, it shall return an existing health and return 201', async () => {

        const createHealthRead = prisma.test.create({
            data: healthBodyMock
        })

        const result = await supertest(app).get(`/health/read/${healthBodyMock.email}`);
        //console.log(`/health/read/:${healthBodyMock.email}`)
        const status = result.status

        expect(status).toBe(200)
    })

})

