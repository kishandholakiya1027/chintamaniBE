import { validationResult } from "express-validator";
import { Product } from "../../entities/ProductModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { getRepository } from "typeorm";
import { Request, Response } from 'express';

export const Trading_Product = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { Clarity, Cuts, Color, shape, categoryid } = req.query

            const ProductRepo = getRepository(Product);

            const qurey = ProductRepo.createQueryBuilder('Product')
                .leftJoinAndSelect('Product.subcategoryid', 'subcategoryid')
                .leftJoinAndSelect('Product.categoryid', 'categoryid')
                .leftJoinAndSelect('Product.innercategoryid', 'innercategoryid')
                .select()

            if (categoryid) {
                qurey.where('Product.categoryid = :categoryid ', { categoryid: categoryid })
            }

            if (shape) {
                qurey.where('Product.shape = :shape ', { shape: shape })
            }

            if (Clarity && Clarity.length) {
                qurey.andWhere('Product.clarity IN (:...clarity)', { clarity: JSON.parse(Clarity) })
            }

            if (Cuts && Cuts.length) {
                qurey.andWhere('Product.cut IN (:...cut)', { cut: JSON.parse(Cuts) })
            }

            if (Color && Color.length) {
                qurey.andWhere('Product.colour IN (:...colour)', { colour: JSON.parse(Color) })
            }

            qurey.limit(4)

            const product = await qurey.getManyAndCount()

            if (!product) {
                return RoutesHandler.sendError(res, req, 'Product Not Found', ResponseCodes.success);
            }

            return RoutesHandler.sendSuccess(res, req, product, "Product Created Successfully")
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    });
}