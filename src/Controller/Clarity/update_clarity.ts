import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Clarity } from "../../entities/ClarityModel";
import { getRepository } from "typeorm";

export const Update_Clarity = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { clarityid, name } = req.body

            const ClarityRepo = getRepository(Clarity);

            const existingClarity = await ClarityRepo.findOne({ where: { id: clarityid } });

            existingClarity.name = name || existingClarity.name

            await ClarityRepo.save(existingClarity)
                .then((data) => {
                    return RoutesHandler.sendSuccess(res, req, data, 'Clarity updated successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to update Clarity', ResponseCodes.saveError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}