import { validationResult } from "express-validator";
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Blog } from "../../entities/BlogModel";
import { getRepository } from "typeorm";

export const Remove_Blog = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
      }
      const blogid = req.params.blogid;

      const BlogRepo = getRepository(Blog);

      const existBlog = await BlogRepo.findOne({ where: { id: blogid } });

      if (!existBlog) {
        return RoutesHandler.sendError(res, req, 'Blog not found', ResponseCodes.general);
      }

      const RemoveBlog = await BlogRepo.remove(existBlog);

      if (RemoveBlog) {
        return RoutesHandler.sendSuccess(res, req, null, "Blog Deleted Successfully")
      } else {
        return RoutesHandler.sendError(res, req, 'Blog Not Created', ResponseCodes.general);
      }

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}