import { Router } from "express";
import { createCredential, getCredentials, getCredentialByID, deleteCredentialByID } from "../controllers/credentials.controller";
import { validateCredentialSchema, validateUserIDSchema } from "../middlewares/credential.middleware";

const credentialRouter = Router()
credentialRouter.post('/create',validateCredentialSchema, createCredential)
credentialRouter.get('/read', getCredentials)
credentialRouter.get('/read/:id',validateUserIDSchema, getCredentialByID)
credentialRouter.delete('/delete/:id',validateUserIDSchema, deleteCredentialByID)

export default credentialRouter;