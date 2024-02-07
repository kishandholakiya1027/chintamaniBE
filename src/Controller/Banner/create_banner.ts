import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Banner } from "../../entities/BannerModel";
import { getRepository } from "typeorm";
import { FileService } from "../../services/backblaze-upload";
const fileService = new FileService();


export const Create_Banner = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
      } 

      const { title, description, redirectUrl } = req.body
  
      const BannerRepo = getRepository(Banner);

      let existingBanner = await BannerRepo.findOne({ where: { title: title } });

      if (existingBanner) {
        return RoutesHandler.sendError(res, req, 'Banner already in Exis', ResponseCodes.general);
      }
      
      // let image

      // if (req.file) {
      //   const BannerimagesPath = [req.file].map((item: any) => item.path.replace(/\\/g, "/"))
        // image = await fileService.uploadFileInS3("Banner", BannerimagesPath)
      // }

      const qurey = await BannerRepo.create({
        title: title,
        description: description,
        redirectUrl: redirectUrl,
        image: req.file ? `/upload/${req.file.filename}` : null
      })

      const NewBanner = await BannerRepo.save(qurey);

      if (NewBanner) {
        return RoutesHandler.sendSuccess(res, req, NewBanner, "Banner Created Successfully")
      } else {
        return RoutesHandler.sendError(res, req, 'Banner Not Created', ResponseCodes.general);
      }

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}