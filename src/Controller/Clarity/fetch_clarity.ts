import { RoutesHandler } from "src/utils/ErrorHandler";
import { ResponseCodes } from "src/utils/response-codes";
import { Request, Response } from 'express';
import { Clarity } from "src/entities/ClarityModel";
import { getRepository } from "typeorm";

export const fetch_Clarity = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const ClarityRepo = getRepository(Clarity);

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

            const qurey = ClarityRepo.createQueryBuilder('innercategory')
                .select()
                .skip((page - 1) * pageSize)
                .take(pageSize)

            const [Claritydata, total] = await qurey.getManyAndCount()

            if (!Claritydata || Claritydata.length === 0) {
                return RoutesHandler.sendSuccess(res, req, [], 'Clarity Not Found');
            }

            return RoutesHandler.sendSuccess(res, req, { Claritydata, total, page, pageSize }, "Clarity Found Successfully")

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}