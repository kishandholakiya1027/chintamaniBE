import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Color } from "../../entities/ColorModel";
import { getRepository } from "typeorm";

export const Remove_Color = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { colorid } = req.params;

            const ColorRepo = getRepository(Color);

            const RemoveColor = await ColorRepo.findOne({ where: { id: colorid } });

            if (!RemoveColor) {
                return RoutesHandler.sendError(res, req, 'Color not found', ResponseCodes.inputError);
            }

            await ColorRepo.remove(RemoveColor)
                .then(() => {
                    return RoutesHandler.sendSuccess(res, req, null, 'Color Remove successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to delete Color', ResponseCodes.serverError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}