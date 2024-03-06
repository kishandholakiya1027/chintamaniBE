import { Response } from "express";
import { validationResult } from "express-validator";
import { getRepository } from "typeorm";
import { Currencies } from "../../entities/currencyModel";
import { CurrencyPrice } from "../../entities/currencyPriceModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";

export const update_Currency = (
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

      const { name } = req.body;

      const { currencyid } = req.params;
      const CurrenciesRepo = getRepository(Currencies);
      const CurrencyPriceRepo = getRepository(CurrencyPrice);

      const findCurrency = await CurrenciesRepo.findOne({
        where: { id: currencyid },
      });

      if (!findCurrency) {
        return RoutesHandler.sendError(
          res,
          req,
          "Currency not found",
          ResponseCodes.inputError
        );
      }

      const getPriceData = await CurrencyPriceRepo.findOne({
        where: { code: name },
      });

      const getPriceid: any = getPriceData?.id;

      const data = {
        ...req.body,
        currencypriceid: getPriceid,
      };

      await CurrenciesRepo.update(currencyid, data).then((data) => {
        return RoutesHandler.sendSuccess(
          res,
          req,
          data,
          "Currency Updated Successfully"
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
