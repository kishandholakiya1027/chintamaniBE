import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Color } from "../../entities/ColorModel";
import { getRepository } from "typeorm";

export const Update_Color = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { colorid, name } = req.body

            const ColorRepo = getRepository(Color);

            const existingColor = await ColorRepo.findOne({ where: { id: colorid } });

            existingColor.name = name || existingColor.name

            await ColorRepo.save(existingColor)
                .then((data) => {
                    return RoutesHandler.sendSuccess(res, req, data, 'Color updated successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to update Color', ResponseCodes.saveError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}