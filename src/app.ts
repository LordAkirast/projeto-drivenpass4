import express, { Express } from 'express';
import 'express-async-errors'
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import healthRouter from './routers/health.routers';
import usersRouter from './routers/users.routers';
import credentialRouter from './routers/credential.routers';
import networkRouter from './routers/network.routers';
import { validateHealthSchema } from './middlewares/health.middleware';
import { authenticationValidation } from './middlewares/authentication.middleware';


const prisma = new PrismaClient()

///agora tem que criar joi para usersRouter e depois criar testes
///depois ler o negócio do notion e continuar criando, talvez, login?

const app = express()

app
    .use(cors())
    .use(express.json())
    .use('/health',authenticationValidation, healthRouter)
    .use('/users', usersRouter)
    .use('/credential',authenticationValidation, credentialRouter)
    .use('/network', networkRouter)







export default app