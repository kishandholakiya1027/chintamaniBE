import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Shape } from "../../entities/ShapeModel";
import { getRepository } from "typeorm";

export const fetch_Shape = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const ShapeRepo = getRepository(Shape);

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

            const qurey = ShapeRepo.createQueryBuilder('shape')
                .select()
                .skip((page - 1) * pageSize)
                .take(pageSize)

            const [Shapedata, total] = await qurey.getManyAndCount()

            if (!Shapedata || Shapedata.length === 0) {
                return RoutesHandler.sendSuccess(res, req, [], 'Shape Not Found');
            }

            return RoutesHandler.sendSuccess(res, req, { Shapedata, total, page, pageSize }, "Shape Found Successfully")

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}