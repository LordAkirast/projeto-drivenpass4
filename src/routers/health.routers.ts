import { Router } from "express";
import { healthCreate, healthDelete, healthRead, healthReadByEmail, healthTest, healthUpdate } from "../controllers/health.controllers";

const healthRouter = Router();

healthRouter.get('/ok', (_req, res) => res.send('OK!'))
healthRouter.post('/', healthTest)
healthRouter.post('/create', healthCreate)
healthRouter.get('/read', healthRead)
healthRouter.get('/read/:email', healthReadByEmail)
healthRouter.put('update', healthUpdate)
healthRouter.delete('/delete', healthDelete)

export default healthRouter;