import { Router } from "express";
import { createNetwork, getNetwork, getNetworkById } from "../controllers/network.controller";
import express, { Express } from 'express';
import cors from 'cors';

const networkRouter = Router()
networkRouter.post('/create', createNetwork)
networkRouter.get('/read', getNetwork)
networkRouter.get('/read/:id', getNetworkById);
//credentialRouter.post('/login', validateUsersSchema, loginUser)
//credentialRouter.post('/logout', logoutUser)
//credentialRouter.delete('/delete', deleteAllUsers)


export default networkRouter;