export class NotFoundError extends Error {
    status: number;

    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        this.status = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class InternalServerError extends Error {
    status: number;

    constructor(message: string = "Internal Server Error") {
        super(message);
        this.name = "InternalServerError";
        this.status = 500;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

export class WrongDataError extends Error {
    status: number;

    constructor(message: string) {
        super(message);
        this.name = "WrongLoginDataError";
        this.status = 401;
        Object.setPrototypeOf(this, WrongDataError.prototype);
    }
}


export class ConflictError extends Error {
    status: number;

    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
        this.status = 409;
        Object.setPrototypeOf(this, ConflictError.prototype); // Adicione esta linha
    }
}
