import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { ResponseCodes } from '../../utils/response-codes';
import { validationResult } from 'express-validator';
import { Product } from '../../entities/ProductModel';
import { WhishList } from '../../entities/WhishlistModel';

export class WhishlistController {
    constructor() { }

    public async CreateWhishlist(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { userid, productid } = req.body;
                const WhishlistRepo = getRepository(WhishList);
                const ProductRepo = getRepository(Product);

                let existingWhishList = await WhishlistRepo.findOne({ where: { userid: { id: userid } }, relations: ['whishlist_products_id'] });

                if (existingWhishList) {

                    if (existingWhishList.whishlist_products_id.some(item => item.id === productid)) {
                        return RoutesHandler.sendError(res, req, 'Product already in Whishlist', ResponseCodes.general);
                    } else {

                        const Productdata = await ProductRepo.findOne({
                            where: { id: productid }
                        });

                        existingWhishList.whishlist_products_id.push(Productdata);

                        const Whishlist = await WhishlistRepo.save(existingWhishList);

                        return RoutesHandler.sendSuccess(res, req, Whishlist, "Product Added Successfully")
                    }

                } else {

                    const WhishlistProduct = await WhishlistRepo.create({
                        userid: userid
                    })

                    const NewSaveWhishlist = await WhishlistRepo.save(WhishlistProduct);

                    const data = await ProductRepo.findOne({
                        where: { id: productid }
                    });

                    if (!NewSaveWhishlist.whishlist_products_id) {
                        NewSaveWhishlist.whishlist_products_id = [data];
                    } else {
                        NewSaveWhishlist.whishlist_products_id.push(data);
                    }

                    const NewSaveWhishListData = await WhishlistRepo.save(NewSaveWhishlist);

                    const populatedWhishlist = await WhishlistRepo.findOne({
                        where: { id: NewSaveWhishListData.id },
                        relations: ['whishlist_products_id']
                    });

                    return RoutesHandler.sendSuccess(res, req, populatedWhishlist, "Whishlist Created Successfully")
                }

            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }
        });
    }

    public async GetWhishlist(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { userid } = req.params;

                const WhishListRepo = getRepository(WhishList);

                let existingWhislist = await WhishListRepo.findOne({ where: { userid: { id: userid } }, relations: ['userid', 'whishlist_products_id'] });

                if (!existingWhislist) {
                    return RoutesHandler.sendSuccess(res, req, [], 'Item Not Found');
                }

                return RoutesHandler.sendSuccess(res, req, existingWhislist, "Item Found Successfully")

            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }

        });
    }

    public async RemoveWhishlist(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { userid, productid } = req.body;

                const WhishListRepo = getRepository(WhishList);

                let existingWhishList = await WhishListRepo.findOne({ where: { userid: { id: userid } }, relations: ['userid', 'whishlist_products_id'] });

                if (existingWhishList.whishlist_products_id.some(item => item.id === productid)) {

                    existingWhishList.whishlist_products_id = existingWhishList.whishlist_products_id.filter(product => product.id !== productid);

                    const WhishList = await WhishListRepo.save(existingWhishList);

                    return RoutesHandler.sendSuccess(res, req, WhishList, "WhishList Added Successfully")

                } else {
                    return RoutesHandler.sendError(res, req, 'Product already in WhishList', ResponseCodes.general);
                }

            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }

        });
    }
}

