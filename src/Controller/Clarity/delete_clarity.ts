import { RoutesHandler } from "src/utils/ErrorHandler";
import { ResponseCodes } from "src/utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Clarity } from "src/entities/ClarityModel";
import { getRepository } from "typeorm";

export const Remove_Clarity = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { clarityid } = req.param;

            const ClarityRepo = getRepository(Clarity);

            const RemoveClarity = await ClarityRepo.findOne({ where: { id: clarityid } });

            if (!RemoveClarity) {
                return RoutesHandler.sendError(res, req, 'clarity not found', ResponseCodes.inputError);
            }

            await ClarityRepo.remove(RemoveClarity)
                .then(() => {
                    return RoutesHandler.sendSuccess(res, req, null, 'clarity Remove successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to delete product', ResponseCodes.serverError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}