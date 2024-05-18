import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient()

export function authentication(req: Request, res: Response) {
    const {authorization} = req.headers
}