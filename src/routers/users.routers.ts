import { Router } from "express";
import { createUser, deleteAllUsers, loginUser } from "../controllers/users.controllers";
import express, { Express } from 'express';
import cors from 'cors';
import { validateUsersSchema } from "../middlewares/users.middleware";
////import de controllers

const usersRouter = Router()
usersRouter.post('/create', validateUsersSchema, createUser)
usersRouter.post('/login', validateUsersSchema, loginUser)
// healthRouter.get('/read', healthRead)
// healthRouter.get('/read/:email', healthReadByEmail)
// healthRouter.put('update', healthUpdate)
usersRouter.delete('/delete', deleteAllUsers)


export default usersRouter;