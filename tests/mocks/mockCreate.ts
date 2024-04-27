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