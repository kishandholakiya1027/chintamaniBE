import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Shape } from "../../entities/ShapeModel";
import { getRepository } from "typeorm";

export const Update_Shape = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { shapeid, name, description, image } = req.body

            const ShapeRepo = getRepository(Shape);

            const existingShape = await ShapeRepo.findOne({ where: { id: shapeid } });

            existingShape.name = name || existingShape.name
            existingShape.description = description || existingShape.description
            existingShape.image = image || existingShape.image

            await ShapeRepo.save(existingShape)
                .then((data) => {
                    return RoutesHandler.sendSuccess(res, req, data, 'Shape updated successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to update Shape', ResponseCodes.saveError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}