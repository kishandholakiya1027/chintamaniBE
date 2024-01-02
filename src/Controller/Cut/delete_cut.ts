import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Cut } from "../../entities/CutModel";
import { getRepository } from "typeorm";

export const Remove_Cut = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { cutid } = req.params;

            const CutRepo = getRepository(Cut);

            const RemoveCut = await CutRepo.findOne({ where: { id: cutid } });

            if (!RemoveCut) {
                return RoutesHandler.sendError(res, req, 'Cut not found', ResponseCodes.inputError);
            }

            await CutRepo.remove(RemoveCut)
                .then(() => {
                    return RoutesHandler.sendSuccess(res, req, null, 'Cut Remove successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to delete Cut', ResponseCodes.serverError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}