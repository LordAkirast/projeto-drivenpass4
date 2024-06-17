import { Router } from "express";
import { createCredential, getCredentials, getCredentialByID, deleteCredentialByID } from "../controllers/credentials.controller";

const credentialRouter = Router()
credentialRouter.post('/create', createCredential)
credentialRouter.get('/read', getCredentials)
credentialRouter.get('/read/:id', getCredentialByID)
credentialRouter.delete('/delete/:id', deleteCredentialByID)

export default credentialRouter;