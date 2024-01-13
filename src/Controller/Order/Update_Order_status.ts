import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { validationResult } from "express-validator";
import { Color } from "../../entities/ColorModel";
import { getRepository } from "typeorm";
import { Order } from "../../entities/OrderModel";

export const Update_Order_status = (req: any, res: Response, next): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
            }

            const { orderid, orderstatus, orderNote, payment, Address } = req.body

            const OrderRepo = getRepository(Order);

            const existingOrder = await OrderRepo.findOne({ where: { id: orderid } });

            if (!existingOrder) {
                return RoutesHandler.sendError(res, req, 'Order Not Found', ResponseCodes.saveError);
            }

            existingOrder.orderstatus = Number(orderstatus) || existingOrder.orderstatus
            existingOrder.orderNote = orderNote || existingOrder.orderNote
            existingOrder.payment = Number(payment) || existingOrder.payment
            existingOrder.Address = Address || existingOrder.Address

            await OrderRepo.save(existingOrder)
                .then((data) => {
                    return RoutesHandler.sendSuccess(res, req, data, 'Order updated successfully');
                })
                .catch((err) => {
                    console.log(err);
                    return RoutesHandler.sendError(res, req, 'Failed to update Order', ResponseCodes.saveError);
                });

        } catch (error) {
            console.log(error, "Error")
            return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
        }
    })
}