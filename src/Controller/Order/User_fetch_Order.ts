import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Order } from "../../entities/OrderModel";

export const User_Orders = async (req: any, res: Response, next): Promise<any> => {
    try {

        const { userid } = req.params

        const orderRepository = getRepository(Order);

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

        const orders = await orderRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.order_item', 'order_item')
            .leftJoinAndSelect('order.userid', 'userid')
            .where('order.userid = :userid', { userid: userid })
            .orderBy('order.createdAt', 'DESC')
            .select()
            .skip((page - 1) * pageSize)
            .take(pageSize)

        const [Orderdata, total] = await orders.getManyAndCount()

        if (!Orderdata || Orderdata.length === 0) {
            return RoutesHandler.sendSuccess(res, req, [], 'Order Not Found');
        }

        const responceData = Orderdata.map((order) => ({
            id: order.id,
            userid: order.userid,
            totalprice: order.totalprice,
            orderDetails: order.orderDetails,
            orderstatus: order.orderstatus,
            orderNote: order.orderNote,
            deliveredAt: order.deliveredAt,
            payment: order.payment,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            productResponse: order.order_item.map((item, index) => ({
                product: item,
                quantity: order.quantity[index],
            })),
        }));

        return RoutesHandler.sendSuccess(res, req, { responceData, total, page, pageSize }, "Order Successfully Found");

    } catch (error) {
        console.log(error, "Error");
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
};
