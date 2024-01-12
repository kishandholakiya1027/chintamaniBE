import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Order } from "../../entities/OrderModel";

export const Fetch_single_Orders = async (req: any, res: Response, next): Promise<any> => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
        }

        const { orderid } = req.params

        const orderRepository = getRepository(Order);

        const orders = await orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.order_item', 'order_item')
            .where('order.id = :id ', { id: orderid })
            .select()

        const Orderdata = await orders.getOne()

        if (!Orderdata) {
            return RoutesHandler.sendSuccess(res, req, [], 'Order Not Found');
        }
        return RoutesHandler.sendSuccess(res, req, Orderdata, "Order Successfully found");

    } catch (error) {
        console.log(error, "Error");
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
};
