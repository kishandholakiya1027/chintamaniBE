import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { ResponseCodes } from '../../utils/response-codes';
import { Cart } from '../../entities/CartModel';
import { validationResult } from 'express-validator';
import { Product } from '../../entities/ProductModel';

export class CartController {
    constructor() { }

    public async CreateCart(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { userid, productid } = req.body;
                const CartRepo = getRepository(Cart);
                const ProductRepo = getRepository(Product);

                let existingCart = await CartRepo.findOne({ where: { userid: { id: userid } }, relations: ['products_id'] });

                if (existingCart) {

                    if (existingCart.products_id.some(item => item.id === productid)) {
                        return RoutesHandler.sendError(res, req, 'Product already in Cart', ResponseCodes.general);
                    } else {

                        const Productdata = await ProductRepo.findOne({
                            where: { id: productid }
                        });

                        existingCart.products_id.push(Productdata);

                        const Cart = await CartRepo.save(existingCart);

                        return RoutesHandler.sendSuccess(res, req, Cart, "Product Added Successfully")
                    }

                } else {

                    const CartProduct = await CartRepo.create({
                        userid: userid
                    })

                    const NewSaveCart = await CartRepo.save(CartProduct);

                    const data = await ProductRepo.findOne({
                        where: { id: productid }
                    });

                    if (!NewSaveCart.products_id) {
                        NewSaveCart.products_id = [data];
                    } else {
                        NewSaveCart.products_id.push(data);
                    }
                    console.log(NewSaveCart, "NewSaveCart")
                    const NewSaveCartData = await CartRepo.save(NewSaveCart);

                    const populatedCart = await CartRepo.findOne({
                        where: { id: NewSaveCartData.id },
                        relations: ['products_id']
                    });

                    console.log(populatedCart, "populatedCart")

                    return RoutesHandler.sendSuccess(res, req, populatedCart, "Cart Created Successfully")
                }

            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }
        });
    }

    public async GetCart(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { userid } = req.params;

                const CartRepo = getRepository(Cart);

                let existingCart = await CartRepo.findOne({ where: { userid: { id: userid } }, relations: ['userid', 'products_id'] });

                if (!existingCart) {
                    return RoutesHandler.sendSuccess(res, req, [], 'Item Not Found');
                }

                return RoutesHandler.sendSuccess(res, req, existingCart, "Item Found Successfully")

            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }

        });
    }

    public async RemoveCart(req: any, res: Response, next): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
                }

                const { userid, productid } = req.body;

                const CartRepo = getRepository(Cart);

                let existingCart = await CartRepo.findOne({ where: { userid: { id: userid } }, relations: ['userid', 'products_id'] });

                if (existingCart.products_id.some(item => item.id === productid)) {

                    existingCart.products_id = existingCart.products_id.filter(product => product.id !== productid);

                    const Cart = await CartRepo.save(existingCart);

                    return RoutesHandler.sendSuccess(res, req, Cart, "Product Added Successfully")

                } else {
                    return RoutesHandler.sendError(res, req, 'Product already in Cart', ResponseCodes.general);
                }

            } catch (error) {
                console.log(error, "Error")
                return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
            }

        });
    }
}

