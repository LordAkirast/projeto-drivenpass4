import { Router } from "express";
import { createUser, deleteAllUsers, loginUser, logoutUser } from "../controllers/users.controllers";
import express, { Express } from 'express';
import cors from 'cors';
import { validateUsersSchema, validateUserIDSchema } from "../middlewares/users.middleware";
import { createCredential, getCredentials } from "../controllers/credentials.controller";
////import de controllers

const credentialRouter = Router()
credentialRouter.post('/create', createCredential)
credentialRouter.get('/get', getCredentials)
//credentialRouter.post('/login', validateUsersSchema, loginUser)
//credentialRouter.post('/logout', logoutUser)
//credentialRouter.delete('/delete', deleteAllUsers)


export default credentialRouter;