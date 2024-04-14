import express, { Express } from 'express';
import 'express-async-errors'
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import healthRouter from './routers/health.routers';
import usersRouter from 'routers/users.routers';


const prisma = new PrismaClient()

const app = express()

app.use('/health',healthRouter)
app.use('/users', usersRouter)

app
    .use(cors())
    .use(express.json())
    




export default app