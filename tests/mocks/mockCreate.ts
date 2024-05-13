import { faker } from "@faker-js/faker"


export const healthBodyMock = {
    email: faker.internet.email(),
    name: faker.person.fullName(),

}

export const healthEmailMock = {
    email: faker.internet.email(),

}

export const usersBodyMock = {
    email: faker.internet.email(),
    password: faker.internet.password()
}

export const usersLoginBodyMock = {
    email: faker.internet.email(),
    password: faker.internet.password()
}

export const usersLogoutBodyMock = {
    userID: 1
}

export const credentialBodyMock = {
    title: faker.lorem.word(),
    url: faker.internet.url(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
}

export const networkBodyMock = {
    title: faker.lorem.word(),
    network: faker.internet.domainName(),
    password: faker.internet.password(),
}