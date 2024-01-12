import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Order } from "../../entities/OrderModel";

export const getAllOrders = async (req: any, res: Response, next): Promise<any> => {
  try {
    const orderRepository = getRepository(Order);
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

    const orders = await orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.order_item', 'order_item')
      .select()
      .skip((page - 1) * pageSize)
      .take(pageSize)

    const [Orderdata, total] = await orders.getManyAndCount()

    if (!Orderdata || Orderdata.length === 0) {
      return RoutesHandler.sendSuccess(res, req, [], 'Order Not Found');
    }
    return RoutesHandler.sendSuccess(res, req, { Orderdata, total, page, pageSize }, "Order Successfully Added");

  } catch (error) {
    console.log(error, "Error");
    return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
  }
};
