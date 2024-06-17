import { Router } from "express";
import { createNetwork, getNetwork, getNetworkById, deleteNetworkById, DEVdeleteAllNetworks } from "../controllers/network.controller";
import express, { Express } from 'express';
import cors from 'cors';

const networkRouter = Router()
networkRouter.post('/create', createNetwork)
networkRouter.get('/read', getNetwork)
networkRouter.get('/read/:id', getNetworkById);
networkRouter.delete('/delete/:id', deleteNetworkById);
networkRouter.delete('/delete', DEVdeleteAllNetworks)

export default networkRouter;