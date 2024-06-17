import { Router } from "express";
import { createNetwork, getNetwork, getNetworkById, deleteNetworkById, DEVdeleteAllNetworks } from "../controllers/network.controller";
import { validateNetworkIDSchema, validateNetworkSchema } from "../middlewares/network.middleware";

const networkRouter = Router()
networkRouter.post('/create',validateNetworkSchema, createNetwork)
networkRouter.get('/read', getNetwork)
networkRouter.get('/read/:id',validateNetworkIDSchema, getNetworkById);
networkRouter.delete('/delete/:id',validateNetworkIDSchema, deleteNetworkById);
networkRouter.delete('/delete', DEVdeleteAllNetworks)

export default networkRouter;