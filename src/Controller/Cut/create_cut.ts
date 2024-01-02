import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Cut } from "../../entities/CutModel";
import { getRepository } from "typeorm";

export const Cteate_Cut = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { name } = req.body

            const CutRepo = getRepository(Cut);

            let existingCut = await CutRepo.findOne({ where: { name: name } });

            if (existingCut) {
                return RoutesHandler.sendError(res, req, ' Cut already in Exis', ResponseCodes.general);
            }

            const qurey = await CutRepo.create({
                name: name
            })

            const NewCut = await CutRepo.save(qurey);

            if (NewCut) {
                return RoutesHandler.sendSuccess(res, req, NewCut, "Cut Created Successfully")
            }

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}