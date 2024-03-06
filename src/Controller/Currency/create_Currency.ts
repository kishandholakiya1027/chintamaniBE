import { Response } from "express";
import { validationResult } from "express-validator";
import { getRepository } from "typeorm";
import { Currencies } from "../../entities/currencyModel";
import { CurrencyPrice } from "../../entities/currencyPriceModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";

export const Create_Currency = (req: any, res: Response): Promise<any> => {
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

      const { name, description, image } = req.body;

      const CurrencyRepo = getRepository(Currencies);
      const CurrencyPriceRepo = getRepository(CurrencyPrice);

      let existingCart: any = await CurrencyRepo.findOne({
        where: { name },
      });

      const getPriceData = await CurrencyPriceRepo.findOne({
        where: { code: name },
      });

      if (!existingCart) {
        const getPriceid: any = getPriceData?.id;
        const qurey = await CurrencyRepo.create({
          name,
          description,
          image,
          currencypriceid: getPriceid,
        });

        const NewCurrency = await CurrencyRepo.save(qurey);
        if (NewCurrency) {
          return RoutesHandler.sendSuccess(
            res,
            req,
            NewCurrency,
            "Currency Created Successfully"
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
      return RoutesHandler.sendError(
        res,
        req,
        error,
        ResponseCodes.serverError
      );
    }
  });
};
