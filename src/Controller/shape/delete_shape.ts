import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Shape } from "../../entities/ShapeModel";
import { getRepository } from "typeorm";

export const Remove_Shape = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { shapeid } = req.params;

            const ShapeRepo = getRepository(Shape);

            const RemoveShape = await ShapeRepo.findOne({ where: { id: shapeid } });

            if (!RemoveShape) {
                return RoutesHandler.sendError(res, req, 'Shape not found', ResponseCodes.inputError);
            }

            await ShapeRepo.remove(RemoveShape)
                .then(() => {
                    return RoutesHandler.sendSuccess(res, req, null, 'Shape Remove successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to delete Shape', ResponseCodes.serverError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}