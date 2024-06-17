import { networkBodyProtocol } from "../protocols/network.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import { getSessionsCredentialsRepository, verifyExistingCredentialRepository, createCredentialRepository, getAllCredentialRepository, getUniqueCredentialRepository, deleteCredentialByIDRepository } from "../repositories/credentials.repositories";
import { NotFoundError, ConflictError, UnauthorizedError, BadRequestError } from "../errors/errorMessages";
import { createNetworkRepository, getNetworkByIDRepository, getNetworkRepository, getSessionsNetworkRepository } from "../repositories/network.repositories";
import { createNetwork } from "../controllers/network.controller";
import { VerifyExistingSession } from "repositories/sessionsValidation.repositories";

export async function createNetworkService(user, networkBody, hashedPassword) {


    const userData = await getSessionsNetworkRepository(user)
  

    if (!userData) {
        throw new NotFoundError('User session not found. User is not logged.')
    }


  const createNetwork = await createNetworkRepository(networkBody, userData, hashedPassword)

  return createNetwork

}

export async function getNetworkService(user) {


  const userData = await getSessionsNetworkRepository(user)


  if (!userData) {
      throw new NotFoundError('User session not found. User is not logged.')
  }


const myNetworks = await getNetworkRepository(userData)

return myNetworks

}

export async function getNetworkByIDService(user, id) {


  const userData = await getSessionsNetworkRepository(user)


  if (!userData) {
      throw new NotFoundError('User session not found. User is not logged.')
  }


const myUniqueNetwork = await getNetworkByIDRepository(id, userData)

if (!myUniqueNetwork) {
  throw new NotFoundError('Network not found');
}

return myUniqueNetwork

}
