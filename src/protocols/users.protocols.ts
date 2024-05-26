export type userBodyProtocol = {
    email: string,
    password: string
}

export type userSessionBodyProtocol = {
    id: number,
    user: string,
    email: string,
    token: string,
    userId: number
}