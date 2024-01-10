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
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { userid, totalprice, orderNote, deliveredAt } = req.body

            const OrderRepo = getRepository(Order);
            const CartRepo = getRepository(Cart);

            let existingCart: any = await CartRepo.findOne({ where: { userid: { id: userid } }, relations: ['products_id'] });
            if (existingCart) {
                let cartTotal = 0;
                let product
                for (let i = 0; i < existingCart.products_id.length; i++) {
                    product = existingCart.products_id[i];
                    const quantity = parseInt(existingCart.quantity[i]);

                    if (!isNaN(product.disccount_price || product.price) && !isNaN(quantity)) {
                        cartTotal += parseFloat(product.disccount_price || product.price) * quantity;
                    } else {
                        return RoutesHandler.sendError(res, req, 'Invalid price or quantity for product:', ResponseCodes.searchError);
                    }
                }
                if (cartTotal == Number(totalprice)) {
                    const instance = new Razorpay({
                        key_id: 'rzp_test_OiDl4onYPZ2HUs',
                        key_secret: '6OJF5WwjLdg1ECGpXtws6UPq',
                    });

                    const options = {
                        amount: cartTotal,
                        currency: "INR",
                        receipt: "receipt_order_74394",
                    };
                    const order = await instance.orders.create(options);
                    let productids = existingCart.products_id.map((item) => item)
                    const NewOrder = await OrderRepo.save((await OrderRepo.create({
                        userid: userid,
                        totalprice: totalprice,
                        order_item: productids,
                        orderDetails: order,
                    })));

                    await CartRepo.remove(existingCart);
                    return RoutesHandler.sendSuccess(res, req, NewOrder, "Order Successfully Added")
                } else {
                    return RoutesHandler.sendError(res, req, 'Price Not Match', ResponseCodes.searchError);
                }
            } else {
                return RoutesHandler.sendError(res, req, 'Item Not Found', ResponseCodes.searchError);
            }
        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}