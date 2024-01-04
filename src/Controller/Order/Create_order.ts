import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Order } from "../../entities/OrderModel";
import { Cart } from "../../entities/CartModel";
import Razorpay from 'razorpay';

export const Cteate_Order = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        // try {
        //     const errors = validationResult(req);

        //     if (!errors.isEmpty()) {
        //         return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
        //     }

        //     const { userid, totalprice, orderNote, deliveredAt, payment } = req.body

        //     const OrderRepo = getRepository(Order);
        //     const CartRepo = getRepository(Cart);

        //     let existingCart = await CartRepo.findOne({ where: { userid: { id: userid } }, relations: ['products_id'] });

        //     if (existingCart) {

        //         const gettotal = (item: any) => {
        //             const Price = item?.disccount_price ? item?.disccount_price : item?.price
        //             return Number(Price);
        //         };

        //         let cartTotal;

        //         existingCart?.products_id?.map((item, index) => {
        //             const total = gettotal(item);
        //             cartTotal = (Number(cartTotal) || 0) + Number(total);
        //         }) || [];

        //         if (cartTotal == Number(totalprice)) {
        //             try {

        //                 const instance = new Razorpay({
        //                     key_id: process.env.RAZORPAY_KEY_ID,
        //                     key_secret: process.env.RAZORPAY_KEY_SECRET,
        //                 });

        //                 const options = {
        //                     amount: cartTotal,
        //                     currency: "INR",
        //                     receipt: "receipt_order_74394",
        //                 };
        //                 const order = await instance.orders.create(options);

        //                 console.log(order, "order")
        //                 // const qurey = await OrderRepo.create({
        //                 //     userid: userid,
        //                 //     totalprice: totalprice,
        //                 //     order_item: existingCart.products_id
        //                 // })

        //                 // const NewOrder = await OrderRepo.save(qurey);
        //             } catch (error) {
        //                 console.log(error)
        //             }

        //         } else {
        //             return RoutesHandler.sendError(res, req, 'Price Not Match', ResponseCodes.searchError);
        //         }
        //     } else {
        //         return RoutesHandler.sendError(res, req, 'item Not Found', ResponseCodes.searchError);
        //     }
        // } catch (error) {
        //     console.log(error, "Error")
        //     return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        // }
    })
}