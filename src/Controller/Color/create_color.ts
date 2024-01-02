import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Color } from "../../entities/ColorModel";
import { getRepository } from "typeorm";

export const Cteate_Color = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { name } = req.body

            const ColorRepo = getRepository(Color);

            let existingColor = await ColorRepo.findOne({ where: { name: name } });

            if (existingColor) {
                return RoutesHandler.sendError(res, req, ' Color already in Exis', ResponseCodes.general);
            }

            const qurey = await ColorRepo.create({
                name: name
            })

            const NewColor = await ColorRepo.save(qurey);

            if (NewColor) {
                return RoutesHandler.sendSuccess(res, req, NewColor, "Color Created Successfully")
            }

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}