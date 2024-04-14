import { Router } from "express";
import { createUser, deleteAllUsers } from "../controllers/users.controllers";
import express, { Express } from 'express';
import cors from 'cors';
////import de controllers

const usersRouter = Router()
usersRouter.post('/create', createUser)
// healthRouter.post('/create', healthCreate)
// healthRouter.get('/read', healthRead)
// healthRouter.get('/read/:email', healthReadByEmail)
// healthRouter.put('update', healthUpdate)
usersRouter.delete('/delete', deleteAllUsers)


export default usersRouter;