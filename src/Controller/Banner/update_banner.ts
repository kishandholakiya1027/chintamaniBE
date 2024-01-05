import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Banner } from "../../entities/BannerModel";
import { getRepository } from "typeorm";
import { FileService } from "../../services/backblaze-upload";
const fileService = new FileService();

export const Update_Banner = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
      }

      const { title, description, bannerid, image, redirectUrl } = req.body

      const BannerRepo = getRepository(Banner)
      const existBanner = await BannerRepo.findOne({ where: { id: bannerid } });

      if (!existBanner) {
        return RoutesHandler.sendError(res, req, 'Banner Not Found', ResponseCodes.searchError);
      }

      existBanner.title = title || existBanner.title;
      existBanner.description = description || existBanner.description;
      existBanner.image = image || existBanner.image;
      existBanner.redirectUrl = redirectUrl || existBanner.redirectUrl

      const Updatedbenner = await BannerRepo.save(existBanner);

      if (Updatedbenner) {
        return RoutesHandler.sendSuccess(res, req, Updatedbenner, "Banner Updated Successfully")
      } else {
        return RoutesHandler.sendError(res, req, 'Banner Update Some Error', ResponseCodes.saveError);
      }

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}