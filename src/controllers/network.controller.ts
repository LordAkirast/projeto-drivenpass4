import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { networkBodyProtocol } from "../protocols/network.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import * as ls from "local-storage";
import bcrypt from "bcrypt";
import { createNetworkService, getNetworkByIDService, getNetworkService } from "../services/network.services";
import handleError from "./handleErrors.controller";

const prisma = new PrismaClient()


export async function createNetwork(req: Request, res: Response) {
    const networkBody = req.body as networkBodyProtocol

    const user: userSessionBodyProtocol = res.locals.users
    const hashedPassword = await bcrypt.hash(networkBody.password, 10);

    try {
        const createNetwork = await createNetworkService(user, networkBody, hashedPassword)

        return res.status(201).json({
            message: operationSuccesfull.message,
            network: createNetwork
        })
    } catch (error) {
        handleError(res, error)
    }
}

export async function getNetwork(req: Request, res: Response) {
    const user: userSessionBodyProtocol = res.locals.users

    try {
        const myNetworks = await getNetworkService(user)

        return res.status(200).json({
            message: operationSuccesfull.message,
            network: myNetworks
        })
    } catch (error) {
        handleError(res, error)

    }
}

export async function getNetworkById(req: Request, res: Response) {
    try {
        const user: userSessionBodyProtocol = res.locals.users
        const { id } = req.params;

        const myUniqueNetwork = getNetworkByIDService(user, id)

        return res.status(200).json(myUniqueNetwork);
    } catch (error) {
        handleError(res, error)
    }
}

export async function deleteNetworkById(req: Request, res: Response) {
    try {
        const user: userSessionBodyProtocol = res.locals.users
        const userToken = user.token

        const userData = await prisma.sessions.findFirst({
            where: { token: userToken }
        })


        if (!userData) {
            return res.status(401).json({ error: 'User session not found' });
        }


        const { id } = req.params;


        const deleteTry = await prisma.network.delete({
            where: { id: Number(id), userId: userData.userId }
        });

        if (!deleteTry) {
            return res.status(409).send('This network does not belongs to you.')
        }


        return res.status(204).send(operationSuccesfull);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function deleteAllNetworks(req: Request, res: Response) {
    prisma.network.deleteMany()
    return res.status(204).send(operationSuccesfull.message)
}

