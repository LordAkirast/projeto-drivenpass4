import express, { Express } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { healthCreate, healthDelete, healthRead, healthReadByEmail, healthTest, healthUpdate, } from './controllers/health.controllers';



const prisma = new PrismaClient()

const app = express()

app
    .use(cors())
    .use(express.json())
    .post('/health', healthTest)
    .post('/health/create', healthCreate)
    .get('/health/read', healthRead)
    .get('/health/read/:email', healthReadByEmail)
    .put('/health/update', healthUpdate)
    .delete('/health/delete', healthDelete)




export default app