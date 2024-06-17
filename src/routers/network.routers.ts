import { Router } from "express";
import { createNetwork, getNetwork, getNetworkById, deleteNetworkById, DEVdeleteAllNetworks } from "../controllers/network.controller";

const networkRouter = Router()
networkRouter.post('/create', createNetwork)
networkRouter.get('/read', getNetwork)
networkRouter.get('/read/:id', getNetworkById);
networkRouter.delete('/delete/:id', deleteNetworkById);
networkRouter.delete('/delete', DEVdeleteAllNetworks)

export default networkRouter;