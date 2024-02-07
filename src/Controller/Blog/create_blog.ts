import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Blog } from "../../entities/BlogModel";
import { getRepository } from "typeorm";
import { FileService } from "../../services/backblaze-upload";
const fileService = new FileService();

export const Create_Blog = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
      }

      const { title, description, author, heading } = req.body

      const BlogRepo = getRepository(Blog);

      let existingBlog = await BlogRepo.findOne({ where: { title: title } });

      if (existingBlog) {
        return RoutesHandler.sendError(res, req, 'Blog Name in alredy Exis', ResponseCodes.general);
      }
      
      // let image
      // if (req.file) {
      //   const blogimagesPath = [req.file].map((item: any) => item.path.replace(/\\/g, "/"))
      //   image = await fileService.uploadFileInS3("blog", blogimagesPath)
      // }

      const qurey = await BlogRepo.create({
        title: title,
        author: author,
        description: description,
        heading: heading,
        image: req.file ? `/upload/${req.file.filename}` : null
      })

      const NewBlog = await BlogRepo.save(qurey);

      if (NewBlog) {
        return RoutesHandler.sendSuccess(res, req, NewBlog, "Blog Created Successfully")
      } else {
        return RoutesHandler.sendError(res, req, 'Blog is Not Created', ResponseCodes.general);
      }

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}