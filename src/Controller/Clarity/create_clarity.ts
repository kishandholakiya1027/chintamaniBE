import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Clarity } from "../../entities/ClarityModel";
import { getRepository } from "typeorm";

export const Cteate_Clarity = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { name } = req.body

            const ClarityRepo = getRepository(Clarity);

            let existingClarity = await ClarityRepo.findOne({ where: { name: name } });

            if (existingClarity) {
                return RoutesHandler.sendError(res, req, ' Clarity already in Exis', ResponseCodes.general);
            }

            const qurey = await ClarityRepo.create({
                name: name
            })

            const NewClarity = await ClarityRepo.save(qurey);

            if (NewClarity) {
                return RoutesHandler.sendSuccess(res, req, NewClarity, "Clarity Created Successfully")
            }

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}