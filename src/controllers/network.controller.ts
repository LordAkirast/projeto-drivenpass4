import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import handleError from "./handleErrors.controller";
import { operationSuccesfull } from "../middlewares/success.middleware";
import { networkBodyProtocol } from "../protocols/network.protocols";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import { DEVdeleteAllNetworkService, createNetworkService, deleteNetworkByIDService, getNetworkByIDService, getNetworkService } from "../services/network.services";
import bcrypt from "bcrypt";

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

        const { id } = req.params;

        const deleteNetworkByID = await deleteNetworkByIDService(user, id)

        return res.status(204).json({ deleteNetworkByID });
    } catch (error) {
        handleError(res, error)
    }
}



////ESSA É UMA FUNÇÃO DEV PARA FACILITAR POR ISSO NÃO TEM VALIDAÇÃO DE TOKEN
export async function deleteAllNetworks(req: Request, res: Response) {

    try {
        DEVdeleteAllNetworkService()
        return res.status(204).send(operationSuccesfull.message)

    } catch (error) {
        handleError(res, error)
    }

}

