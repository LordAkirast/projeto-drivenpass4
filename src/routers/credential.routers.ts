import { Router } from "express";
import { createUser, deleteAllUsers, loginUser, logoutUser } from "../controllers/users.controllers";
import express, { Express } from 'express';
import cors from 'cors';
import { validateUsersSchema, validateUserIDSchema } from "../middlewares/users.middleware";
import { createCredential, getCredentials, getCredentialByID } from "../controllers/credentials.controller";

const credentialRouter = Router()
credentialRouter.post('/create', createCredential)
credentialRouter.get('/read', getCredentials)
credentialRouter.get('/read/:id', getCredentialByID)

export default credentialRouter;