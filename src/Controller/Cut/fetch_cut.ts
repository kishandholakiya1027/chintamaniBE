import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Cut } from "../../entities/CutModel";
import { getRepository } from "typeorm";

export const fetch_Cut = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const CutRepo = getRepository(Cut);

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

            const qurey = CutRepo.createQueryBuilder('cut')
                .select()
                .skip((page - 1) * pageSize)
                .take(pageSize)

            const [Cutdata, total] = await qurey.getManyAndCount()

            if (!Cutdata || Cutdata.length === 0) {
                return RoutesHandler.sendSuccess(res, req, [], 'Cut Not Found');
            }

            return RoutesHandler.sendSuccess(res, req, { Cutdata, total, page, pageSize }, "Cut Found Successfully")

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}