import { Request, Response } from 'express';
import { NotFoundError, ConflictError, WrongDataError, BadRequestError, UnauthorizedError } from "../errors/errorMessages";


function handleError(res: Response, error: Error) {
    console.log("Error instance:", error);
    console.log("Is BadRequestError:", error instanceof BadRequestError);
    console.log("Is UnauthorizedError:", error instanceof UnauthorizedError);
    console.log("Is NotFoundError:", error instanceof NotFoundError);
    console.log("Is ConflictError:", error instanceof ConflictError);
    console.log("Is WrongDataError:", error instanceof WrongDataError);

    if (error instanceof NotFoundError) {
        return res.status(404).json({ error: error.message });
    } else if (error instanceof ConflictError) {
        return res.status(409).json({ error: error.message });
    } else if (error instanceof WrongDataError || error instanceof UnauthorizedError || error instanceof BadRequestError) {
        return res.status(401).json({ error: error.message });
    } else {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default handleError;