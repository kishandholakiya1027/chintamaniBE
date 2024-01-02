import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Color } from "../../entities/ColorModel";
import { getRepository } from "typeorm";

export const fetch_Color = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const ColorRepo = getRepository(Color);

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

            const qurey = ColorRepo.createQueryBuilder('color')
                .select()
                .skip((page - 1) * pageSize)
                .take(pageSize)

            const [Colordata, total] = await qurey.getManyAndCount()

            if (!Colordata || Colordata.length === 0) {
                return RoutesHandler.sendSuccess(res, req, [], 'Color Not Found');
            }

            return RoutesHandler.sendSuccess(res, req, { Colordata, total, page, pageSize }, "Color Found Successfully")

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}