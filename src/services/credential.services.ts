import { credentialBodyProtocol } from "../protocols/credentials.protocols";
import { credentialAlreadyExists } from "../middlewares/errors.middleware";
import { userSessionBodyProtocol } from "../protocols/users.protocols";
import { getSessionsCredentialsRepository, verifyExistingCredentialRepository, createCredentialRepository, getAllCredentialRepository, getUniqueCredentialRepository } from "../repositories/credentials.repositories";
import { NotFoundError, ConflictError } from "../errors/errorMessages";


export async function getCredentialService(user: userSessionBodyProtocol) {

    const userData = await getSessionsCredentialsRepository(user)

    if (!userData) {
        throw new NotFoundError('Token not found on sessions.')
    }

    const myCredentials = await getAllCredentialRepository(user, userData)

    return myCredentials
}

export async function getCredentialByIDService(id, user: userSessionBodyProtocol,) {

    const userData = await getSessionsCredentialsRepository(user)

    if (!userData) {
        throw new NotFoundError('Token not found on sessions.')
    }

    const credentialByID = await getUniqueCredentialRepository(id, userData)

    if (!credentialByID) {
        throw new NotFoundError('There is no credential with this ID belonging to you.')
    }
    
    //console.log(credentialByID)

    return credentialByID
}

export async function createCredentialService(user: userSessionBodyProtocol, credentialBody: credentialBodyProtocol, hashedPassword) {

    const userData = await getSessionsCredentialsRepository(user)

    if (!userData) {
        throw new NotFoundError('User session not found. User is not logged.')
    }

    const credentialData = {
        title: credentialBody.title,
        url: credentialBody.url,
        username: credentialBody.username,
        password: hashedPassword,
        userId: userData.id
    };

    console.log('01 CredentialData: ', credentialData)

    const verifyExistingCredential = await verifyExistingCredentialRepository(credentialBody, userData)


    if (verifyExistingCredential) {
        throw new ConflictError(credentialAlreadyExists.message)
    }

    const createCredential = await createCredentialRepository(credentialData)

    return createCredential

}