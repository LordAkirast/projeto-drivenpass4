import express, { Express } from 'express';
import 'express-async-errors'
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import healthRouter from './routers/health.routers';
import usersRouter from './routers/users.routers';
import credentialRouter from './routers/credential.routers';
import networkRouter from './routers/network.routers';
import { authenticationValidation } from './middlewares/authentication.middleware';


const prisma = new PrismaClient()

const app = express()

app
    .use(cors())
    .use(express.json())
    .use('/health', healthRouter)
    .use('/users', usersRouter)
    .use('/credential',authenticationValidation, credentialRouter)
    .use('/network',authenticationValidation, networkRouter)
    
export default app