import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Cut } from "../../entities/CutModel";
import { getRepository } from "typeorm";

export const Update_Cut = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { cutid, name } = req.body

            const CutRepo = getRepository(Cut);

            const existingCut = await CutRepo.findOne({ where: { id: cutid } });

            existingCut.name = name || existingCut.name

            await CutRepo.save(existingCut)
                .then((data) => {
                    return RoutesHandler.sendSuccess(res, req, data, 'Cut updated successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to update Cut', ResponseCodes.saveError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}