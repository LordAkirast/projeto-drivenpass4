import { networkBodyProtocol } from "../protocols/network.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import { getSessionsCredentialsRepository, verifyExistingCredentialRepository, createCredentialRepository, getAllCredentialRepository, getUniqueCredentialRepository, deleteCredentialByIDRepository } from "../repositories/credentials.repositories";
import { NotFoundError, ConflictError, UnauthorizedError, BadRequestError } from "../errors/errorMessages";
import { DEVdeleteAllNetworksRepository, createNetworkRepository, deleteNetworkByIDRepository, getNetworkByIDRepository, getNetworkRepository, getSessionsNetworkRepository } from "../repositories/network.repositories";
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

export async function getNetworkService(user, cryptr) {


  const userData = await getSessionsNetworkRepository(user)


  if (!userData) {
      throw new NotFoundError('User session not found. User is not logged.')
  }


const myNetworks = await getNetworkRepository(userData)

const networkData = myNetworks.map(network => {
  const unHashedPassword = cryptr.decrypt(network.password);
  return {
      ...network,
      password: unHashedPassword
  };
});

return networkData

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

export async function deleteNetworkByIDService(user, id) {


  const userData = await getSessionsNetworkRepository(user)


  if (!userData) {
      throw new NotFoundError('User session not found. User is not logged.')
  }


const deleteNetworkByID = await deleteNetworkByIDRepository(id, userData)

if (!deleteNetworkByID) {
  throw new UnauthorizedError('This network does not exists or does not belongs to you.');
}

return deleteNetworkByID

}

export async function DEVdeleteAllNetworkService() {


const DEVdeleteAllNetworks = await DEVdeleteAllNetworksRepository()


return DEVdeleteAllNetworks

}