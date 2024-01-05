import { validationResult, param } from 'express-validator';
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Banner } from "../../entities/BannerModel";
import { getRepository } from "typeorm";

export const fetch_Banner = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const BannerRepo = getRepository(Banner);

      let Banners = await BannerRepo.findOne({
        where: { id: req.params.bannerid },
      });

      if (!Banners) {
        return RoutesHandler.sendSuccess(res, req, [], "Banner Not found");
      }

      return RoutesHandler.sendSuccess(res, req, Banners, "Banner Fetched Successfully")

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}


export const fetch_All_Banner = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
      }
      const BannerRepo = getRepository(Banner);
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

      const Banners = BannerRepo.createQueryBuilder('blog')
        .select()
        .skip((page - 1) * pageSize)
        .take(pageSize)

      const [Blogdata, total] = await Banners.getManyAndCount()

      if (!Blogdata || Blogdata.length === 0) {
        return RoutesHandler.sendSuccess(res, req, [], "Banner Not found");
      }

      return RoutesHandler.sendSuccess(res, req, { Blogdata, total, page, pageSize }, "Banner Fetched Successfully")

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}