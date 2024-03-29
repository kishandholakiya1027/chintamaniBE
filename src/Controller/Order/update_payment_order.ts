import { Response } from "express";
import { validationResult } from "express-validator";
import Razorpay from "razorpay";
import { getRepository } from "typeorm";
import { Order, payment_Status } from "../../entities/OrderModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";

export const Update_Order_Payment = (
  req: any,
  res: Response,
  next
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(
          res,
          req,
          errors.array(),
          ResponseCodes.inputError
        );
      }

      const { orderid } = req.body;

      const OrderRepo = getRepository(Order);

      const existingOrder = await OrderRepo.findOne({
        where: { id: orderid, payment: payment_Status.Pendding },
      });

      if (!existingOrder) {
        return RoutesHandler.sendError(
          res,
          req,
          "Order Not Found",
          ResponseCodes.saveError
        );
      }

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: Number(+existingOrder.calculatedPrice * 100).toFixed(),
        currency: existingOrder.currency,
        receipt: "receipt_order_74394",
      };

      const order = await instance.orders.create(options);

      existingOrder.orderDetails = order || existingOrder.orderDetails;

      await OrderRepo.save(existingOrder)
        .then((data) => {
          return RoutesHandler.sendSuccess(
            res,
            req,
            data,
            "Order updated successfully"
          );
        })
        .catch((err) => {
          console.log(err);
          return RoutesHandler.sendError(
            res,
            req,
            "Failed to update Order",
            ResponseCodes.saveError
          );
        });
    } catch (error) {
      console.log(error, "Error");
      return RoutesHandler.sendError(
        res,
        req,
        "Internal Server Error",
        ResponseCodes.serverError
      );
    }
  });
};
