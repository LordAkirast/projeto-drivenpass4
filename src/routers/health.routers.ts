import { Router } from "express";
import { healthCreate, healthDelete, healthRead, healthReadByEmail, healthTest, healthUpdate } from "../controllers/health.controllers";
import { validateHealthSchema, validateHealthUpdateSchema } from "../middlewares/health.middleware";


const healthRouter = Router();

healthRouter.get('/ok', (_req, res) => res.send('OK!'))
healthRouter.post('/', healthTest)
healthRouter.post('/create',validateHealthSchema, healthCreate)
healthRouter.get('/read', healthRead)
healthRouter.get('/read/:email', healthReadByEmail)
healthRouter.put('update',validateHealthUpdateSchema, healthUpdate)
healthRouter.delete('/delete', healthDelete)

export default healthRouter;