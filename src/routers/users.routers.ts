import { Router } from "express";
import { createUser, deleteAllUsers, loginUser, logoutUser } from "../controllers/users.controllers";
import express, { Express } from 'express';
import cors from 'cors';
import { validateUsersSchema, validateUserIDSchema } from "../middlewares/users.middleware";
import { authenticationValidation } from "../middlewares/authentication.middleware";
////import de controllers

const usersRouter = Router()
usersRouter.post('/create', validateUsersSchema, createUser)
usersRouter.post('/login', validateUsersSchema, loginUser)
usersRouter.post('/logout', authenticationValidation, logoutUser)
usersRouter.delete('/delete', deleteAllUsers)


export default usersRouter;