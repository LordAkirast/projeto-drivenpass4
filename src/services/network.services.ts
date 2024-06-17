import { networkBodyProtocol } from "../protocols/network.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import { getSessionsCredentialsRepository, verifyExistingCredentialRepository, createCredentialRepository, getAllCredentialRepository, getUniqueCredentialRepository, deleteCredentialByIDRepository } from "../repositories/credentials.repositories";
import { NotFoundError, ConflictError, UnauthorizedError, BadRequestError } from "../errors/errorMessages";
import { createNetworkRepository, getSessionsNetworkRepository } from "../repositories/network.repositories";
import { createNetwork } from "../controllers/network.controller";

export async function createNetworkService(user, networkBody, hashedPassword) {


    const userData = await getSessionsNetworkRepository(user)
    

    if (!userData) {
        throw new NotFoundError('User session not found. User is not logged.')
    }


  const createNetwork = await createNetworkRepository(networkBody, userData, hashedPassword)

  return createNetwork

}