import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Blog, Status } from "../../entities/BlogModel";
import { getRepository } from "typeorm";
import { FileService } from "../../services/backblaze-upload";

const fileService = new FileService();

export const Update_Blog = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
      }

      const { title, description, author, blogid, image, heading } = req.body

      const BlogRepo = getRepository(Blog)
      const existBlog = await BlogRepo.findOne({ where: { id: blogid } });

      if (!existBlog) {
        return RoutesHandler.sendError(res, req, 'Blog Not Found', ResponseCodes.searchError);
      }

      existBlog.title = title || existBlog.title
      existBlog.description = description || existBlog.description
      existBlog.author = author || existBlog.author
      existBlog.image = image || existBlog.image
      existBlog.heading = heading || existBlog.heading

      const UpdateBlog = await BlogRepo.save(existBlog);

      if (UpdateBlog) {
        return RoutesHandler.sendSuccess(res, req, UpdateBlog, "Blog Updated Successfully")
      } else {
        return RoutesHandler.sendError(res, req, 'Blog Not Updated', ResponseCodes.searchError);
      }

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}