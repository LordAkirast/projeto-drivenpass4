import { PrismaClient, Sessions, User, Credential } from "@prisma/client";
import { userBodyProtocol, userFindActiveSessionProtocol, userSessionBodyProtocol } from "../protocols/users.protocols";
import { credentialBodyProtocol } from "../protocols/credentials.protocols";
const prisma = new PrismaClient()

export async function getSessionsNetworkRepository(user) {

    const userData = await prisma.sessions.findFirst({
        where: { token: user.token }
    })


    return userData

}

export async function createNetworkRepository(networkBody, userData, hashedPassword) {

    const networkData = {
        title: networkBody.title,
        network: networkBody.network,
        password: hashedPassword,
        userId: userData.userId
    };


    const createNetwork = await prisma.network.create({
        data: networkData
    })


    return createNetwork

}

export async function getNetworkRepository(userData) {

    const myNetworks = await prisma.network.findMany({
        where: { userId: userData.userId }
    })


    return myNetworks

}

export async function getNetworkByIDRepository(id, userData) {

    const myUniqueNetwork = await prisma.network.findFirst({
        where: { id: Number(id), userId: userData.userId }
    });

    return myUniqueNetwork

}

export async function deleteNetworkByIDRepository(id, userData) {


    try {
        const deleteNetworkByID = await prisma.network.delete({
            where: { id: Number(id), userId: userData.userId }
        });


        return deleteNetworkByID

    } catch (error) {
        return null

    }


}