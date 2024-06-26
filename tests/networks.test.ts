import app from '../src/app'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'
import { networkBodyMock, usersBodyMock, networkBodyMockObj } from './mocks/mockCreate';
import * as ls from "local-storage";

const prisma = new PrismaClient();

beforeAll(async () => {
    try {
        await prisma.$executeRaw`TRUNCATE TABLE "Network" RESTART IDENTITY CASCADE`;
    } catch (error) {
        console.error('Erro ao truncar tabelas:', error);
    }
});

afterAll(async () => {
    try {
        await prisma.$executeRaw`TRUNCATE TABLE "Network" RESTART IDENTITY CASCADE`;
    } catch (error) {
        console.error('Erro ao truncar tabelas:', error);
    }
});

describe('/POST Create - Network', () => {
    it('001 - Create: should create a network with valid data and return status 201', async () => {


        await prisma.sessions.deleteMany({
            where: {} 
        });

        await prisma.user.deleteMany({
            where: {}
          });

        await prisma.user.create({
            data: usersBodyMock
        })

        const userData = await prisma.user.findFirst({
            where: { email: usersBodyMock.email, password: usersBodyMock.password }
        })

        const userSession = await prisma.sessions.create({
            data: {
                email: usersBodyMock.email,
                token: 'testlogout',
                userId: userData.id
            } 
        })


        ////isso no get de network
        await prisma.network.create({
            data: networkBodyMock(userData.id)
        })


        const token = userSession.token

        const result = await supertest(app).post('/network/create').set('Authorization', `Bearer ${token}`).send(networkBodyMockObj);
        expect(result.status).toBe(201);
    });

    it('002 - Create: should return status 401 if token is missing', async () => {

        await prisma.sessions.deleteMany({
            where: {} 
        });
        await prisma.network.deleteMany({
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

        await prisma.sessions.create({
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

        const token = ''

        const result = await supertest(app).post('/network/create').set('Authorization', `Bearer ${token}`).send(networkBodyMockObj);
        expect(result.status).toBe(401);
    });

});

describe('/GET Read - Network', () => {
    it('001 - Read: should return user networks with valid token and status 200', async () => {

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

        const result = await supertest(app).get('/network/read').set('Authorization', `Bearer ${token}`);
        expect(result.status).toBe(200);
    });

    it('002 - Read: should return status 401 if token is missing', async () => {

        const result = await supertest(app).get('/network/read');
        expect(result.status).toBe(401);
    });

});


///não sei como fazer para criar uma network e vincular dados do UserID ou algo assim para validar que é do mesmo cara
describe('/GET Read NetworkById', () => {



    it('001 - Read: should return a specific network with valid token and ID and status 200', async () => {
        await prisma.sessions.deleteMany({
            where: {} 
        });

        await prisma.user.deleteMany({
            where: {}
          });

          await prisma.network.deleteMany({
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

        

        const networkData = await prisma.network.create({
            data: {
                title: networkBodyMockObj.title,
                network: networkBodyMockObj.network,
                password: networkBodyMockObj.password,
                userId: userSession.userId
            } 
        })

        const verifyNetworkCreation = await prisma.network.findFirst({
            where: {id: networkData.id}
        })


        const validNetworkId = networkData.id;


        const result = await supertest(app).get(`/network/read/${validNetworkId}`).set('Authorization', `Bearer ${token}`);
        expect(result.status).toBe(200);
    });

});
