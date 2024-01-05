import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Banner } from "../../entities/BannerModel";
import { getRepository } from "typeorm";

export const Remove_Banner = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
      }

      const bannerid = req.params.bannerid;
      const BannerRepo = getRepository(Banner);

      const existBanner = await BannerRepo.findOne({ where: { id: bannerid } });

      if (!existBanner) {
        return RoutesHandler.sendError(res, req, 'Banner not found', ResponseCodes.general);
      }

      const RemoveBennner = await BannerRepo.remove(existBanner);

      if (RemoveBennner) {
        return RoutesHandler.sendSuccess(res, req, null, "Banner deleted successfully")
      } else {
        return RoutesHandler.sendError(res, req, 'Banner found some issue', ResponseCodes.saveError);
      }

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}