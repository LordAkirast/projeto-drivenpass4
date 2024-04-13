import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import healthTest from './controllers/health.controllers';

const prisma = new      PrismaClient()

const app = express()

app
.use('/health', healthTest )

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
