import { Response } from "express";
import { getRepository } from "typeorm";
import { Currencies } from "../../entities/currencyModel";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";

export const fetch_Currency = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const CurrenciesRepo = getRepository(Currencies);

      const page = req.query.page ? parseInt(req.query.page) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

      const qurey = CurrenciesRepo.createQueryBuilder("currency")
        .select()
        .leftJoinAndSelect("currency.currencypriceid", "currencypriceid")
        .skip((page - 1) * pageSize)
        .take(pageSize);

      const [CurrencyData, total] = await qurey.getManyAndCount();

      if (!CurrencyData || CurrencyData.length === 0) {
        return RoutesHandler.sendSuccess(res, req, [], "Currency Not Found");
      }

      return RoutesHandler.sendSuccess(
        res,
        req,
        { CurrencyData, total, page, pageSize },
        "Currency Found Successfully"
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
};
