import { Response } from "express";
import { validationResult } from "express-validator";
import Razorpay from "razorpay";
import { getRepository } from "typeorm";
import { Cart } from "../../entities/CartModel";
import { Order } from "../../entities/OrderModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";

export const Cteate_Order = (req: any, res: Response, next): Promise<any> => {
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

      const {
        userid,
        totalprice,
        Address,
        mobile,
        calculatedPrice,
        deliveredAt,
        products = [],
        currency,
      } = req.body;

      const OrderRepo = getRepository(Order);
      const CartRepo = getRepository(Cart);

      let existingCart: any = await CartRepo.findOne({
        where: { userid: { id: userid } },
        relations: ["products_id"],
      });

      if (existingCart) {
        let cartTotal = 0;
        let quantity = [];
        for (let i = 0; i < existingCart.products_id.length; i++) {
          const product = existingCart.products_id[i];
          const productQuantity = parseInt(existingCart.quantity[i]);
          const updatedProduct = products.find((p) => p.id === product.id);
          if (updatedProduct) {
            const quantityToUpdate = parseInt(updatedProduct.quantity);
            const finalQuantity = !isNaN(quantityToUpdate)
              ? quantityToUpdate
              : productQuantity;
            if (
              !isNaN(+product.disccount_price || +product.price) &&
              !isNaN(+finalQuantity)
            ) {
              cartTotal +=
                +parseFloat(product.disccount_price || product.price) *
                +finalQuantity;
              quantity.push({
                quantity: finalQuantity,
              });
            } else {
              return RoutesHandler.sendError(
                res,
                req,
                "Invalid price or quantity for product:",
                ResponseCodes.searchError
              );
            }
          } else {
            if (
              !isNaN(product.disccount_price || product.price) &&
              !isNaN(productQuantity)
            ) {
              cartTotal +=
                parseFloat(product.disccount_price || product.price) *
                productQuantity;
              quantity.push({
                quantity: productQuantity,
              });
            } else {
              return RoutesHandler.sendError(
                res,
                req,
                "Invalid price or quantity for product:",
                ResponseCodes.searchError
              );
            }
          }
        }
        if (cartTotal == Number(totalprice)) {
          const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
          });
          console.log(cartTotal, "cartTotal");
          const options = {
            amount: Number(calculatedPrice.toFixed() * 100),
            currency: currency,
            receipt: "receipt_order_74394",
          };
          const order = await instance.orders.create(options);

          let productids = existingCart.products_id.map((item) => item);

          var today = new Date();
          var numberOfDaysToAdd = 10;
          var tenDaysPlus = today.setDate(today.getDate() + numberOfDaysToAdd);

          const NewOrder = await OrderRepo.save(
            await OrderRepo.create({
              quantity: quantity.map((item) => item.quantity),
              userid: userid,
              totalprice: totalprice,
              order_item: productids,
              orderDetails: order,
              mobile: mobile,
              Address: Address,
              deliveredAt: today,
              currency: currency,
              calculatedPrice: calculatedPrice.toFixed(),
            })
          );
          await CartRepo.remove(existingCart);

          const productResponse = NewOrder.order_item.map((product, index) => ({
            product: product,
            quantity: quantity[index].quantity,
          }));
          let responceData = {
            id: NewOrder.id,
            userid: NewOrder.userid,
            totalprice: existingCart.userid,
            products: productResponse,
            orderDetails: NewOrder.orderDetails,
            Address: NewOrder.Address,
            mobile: NewOrder.mobile,
            orderstatus: NewOrder.orderstatus,
            orderNote: NewOrder.orderNote,
            deliveredAt: NewOrder.deliveredAt,
            payment: NewOrder.payment,
            createdAt: existingCart.createdAt,
            updatedAt: existingCart.updatedAt,
          };

          return RoutesHandler.sendSuccess(
            res,
            req,
            responceData,
            "Order Successfully Added"
          );
        } else {
          return RoutesHandler.sendError(
            res,
            req,
            "Price Not Match",
            ResponseCodes.searchError
          );
        }
      } else {
        return RoutesHandler.sendError(
          res,
          req,
          "Item Not Found",
          ResponseCodes.searchError
        );
      }
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
