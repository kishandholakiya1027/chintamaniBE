import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Cart } from "../../entities/CartModel";
import { validationResult } from "express-validator";
import { Product } from "../../entities/ProductModel";

export class CartController {
  constructor() {}

  public async CreateCart(req: any, res: Response, next): Promise<any> {
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

        const { userid, productid, quantity } = req.body; // Add quantity to the request body

        const CartRepo = getRepository(Cart);
        const ProductRepo = getRepository(Product);

        let existingCart = await CartRepo.findOne({
          where: { userid: { id: userid } },
          relations: ["products_id"],
        });

        if (existingCart) {
          if (existingCart.products_id.some((item) => item.id === productid)) {
            return RoutesHandler.sendError(
              res,
              req,
              "Product already in Cart",
              ResponseCodes.general
            );
          } else {
            const productData = await ProductRepo.findOne({
              where: { id: productid },
            });

            const updatedCart = await CartRepo.save({
              ...existingCart,
              products_id: [...existingCart.products_id, productData],
              quantity: [...existingCart.quantity, quantity],
            });

            const productResponse = updatedCart.products_id.map(
              (product, index) => ({
                product: product,
                quantity: updatedCart.quantity[index],
              })
            );

            let responceData = {
              id: existingCart.id,
              userid: existingCart.userid,
              products: productResponse,
              createdAt: existingCart.createdAt,
              updatedAt: existingCart.updatedAt,
            };

            return RoutesHandler.sendSuccess(
              res,
              req,
              responceData,
              "Product Added Successfully"
            );
          }
        } else {
          const cartProduct = await CartRepo.create({
            userid: userid,
            quantity: [quantity],
          });

          const newSaveCart = await CartRepo.save(cartProduct);

          const data = await ProductRepo.findOne({
            where: { id: productid },
          });

          // Modify the structure of products_id and quantity in newSaveCart
          newSaveCart.products_id = [data];
          newSaveCart.quantity = [quantity];

          const newSaveCartData = await CartRepo.save(newSaveCart);

          const populatedCart = await CartRepo.findOne({
            where: { id: newSaveCartData.id },
            relations: ["products_id"],
          });

          const productResponse = populatedCart.products_id.map(
            (product, index) => ({
              product: product,
              quantity: populatedCart.quantity[index],
            })
          );

          let responceData = {
            id: newSaveCartData.id,
            userid: newSaveCartData.userid,
            products: productResponse,
            createdAt: newSaveCartData.createdAt,
            updatedAt: newSaveCartData.updatedAt,
          };

          return RoutesHandler.sendSuccess(
            res,
            req,
            responceData,
            "Cart Created Successfully"
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
  }

  public async GetCart(req: any, res: Response, next): Promise<any> {
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

        const { userid } = req.params;

        const CartRepo = getRepository(Cart);

        let existingCart = await CartRepo.findOne({
          where: { userid: { id: userid } },
          relations: ["userid", "products_id"],
        });

        if (!existingCart) {
          return RoutesHandler.sendSuccess(res, req, [], "Item Not Found");
        }

        return RoutesHandler.sendSuccess(
          res,
          req,
          existingCart,
          "Item Found Successfully"
        );
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
  }

  public async RemoveCart(req: any, res: Response, next): Promise<any> {
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

        const { userid, productid } = req.body;

        const CartRepo = getRepository(Cart);

        let existingCart = await CartRepo.findOne({
          where: { userid: { id: userid } },
          relations: ["userid", "products_id"],
        });

        const productIndex = existingCart.products_id.findIndex(
          (item) => item.id === productid
        );

        if (productIndex !== -1) {
          // Remove the product and quantity at the found index
          existingCart.products_id.splice(productIndex, 1);
          existingCart.quantity.splice(productIndex, 1);

          const updatedCart = await CartRepo.save(existingCart);

          const productResponse = updatedCart.products_id.map(
            (product, index) => ({
              product: product,
              quantity: updatedCart.quantity[index],
            })
          );

          let responceData = {
            id: existingCart.id,
            userid: existingCart.userid,
            products: productResponse,
            createdAt: existingCart.createdAt,
            updatedAt: existingCart.updatedAt,
          };

          return RoutesHandler.sendSuccess(
            res,
            req,
            responceData,
            "Product Removed Successfully"
          );
        } else {
          return RoutesHandler.sendError(
            res,
            req,
            "Product not found in Cart",
            ResponseCodes.general
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
  }
}
