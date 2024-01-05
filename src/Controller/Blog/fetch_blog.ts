import { validationResult, param } from 'express-validator';
import { RoutesHandler } from "../../utils/ErrorHandler";
import { ResponseCodes } from "../../utils/response-codes";
import { Request, Response } from 'express';
import { Blog } from "../../entities/BlogModel";
import { getRepository } from "typeorm";

export const fetch_Blog = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const BlogRepo = getRepository(Blog);

      let blogs = await BlogRepo.findOne({
        where: { id: req.params.blogid },
        relations: ["author"],
      });

      if (!blogs) {
        return RoutesHandler.sendError(res, req, 'Blog Not Found', ResponseCodes.general);
      }
      return RoutesHandler.sendSuccess(res, req, blogs, "Blog Fetched Successfully")

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}


export const fetch_All_Blog = (req: any, res: Response, next): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const BlogRepo = getRepository(Blog);
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
      let blogs = BlogRepo.createQueryBuilder('blog')
        .select()
        .skip((page - 1) * pageSize)
        .take(pageSize)

      const [Blogdata, total] = await blogs.getManyAndCount()

      if (!Blogdata || Blogdata.length === 0) {
        return RoutesHandler.sendError(res, req, 'Blog Not Found', ResponseCodes.general);
      } else {
        return RoutesHandler.sendSuccess(res, req, { Blogdata, total, page, pageSize }, "Blog Fetched Successfully")
      }

    } catch (error) {
      console.log(error, "Error")
      return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
    }
  })
}