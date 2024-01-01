import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { FileService } from '../../services/backblaze-upload';
import { ResponseCodes } from '../../utils/response-codes';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { SubCategory } from '../../entities/SubCategoryModel';
import { InnerCategory } from '../../entities/InnerCategoryModel';
const fileService = new FileService();

export class InnerCategoryController {
  constructor() { }

  public async InnnerSubCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, subcategoryid, description } = req.body;
        if (!name || !description || !subcategoryid) {

          return RoutesHandler.sendError(
            res,
            req,
            'All Field Required',
            ResponseCodes.inputError
          );
        }
        const InnerCategoryRepo = getRepository(InnerCategory);
        let image: any = [];

        if (req.file) {
          image = await fileService.uploadFile(
            'subcategory',
            req.file.path.replace(/\\/g, '/'),
            req.file.filename
          );
        }

        let subcategory = {
          name,
          subcategoryid: subcategoryid,
          description,
          image: [image.fileName],
        };

        const newSubCategory = InnerCategoryRepo.create(subcategory);

        await InnerCategoryRepo.save(newSubCategory);

        return res.status(ResponseCodes.success).json({
          message: 'SubCategory created successfully',
          data: newSubCategory,
        });

      } catch (error) {
        console.log(error);
        return next({
          statusCode: ResponseCodes.serverError,
          message: 'Internal Server Error',
        });
      }
    });
  }

  public async getAllSubCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {

        const InnerCategoryRepo = getRepository(InnerCategory);

        await InnerCategoryRepo
          .find({ relations: ['subcategoryid'] })
          .then((data) => {
            return res.status(ResponseCodes.success).json({
              message: 'SubCategory Fatched Successfully',
              status: true,
              data: data,
            });
          })
          .catch((err) => {
            console.log(err);

            return next({
              statusCode: ResponseCodes.saveError,
              message: 'SubCategory can not be fatched',
            });
          });
      } catch (error) {
        return next({
          statusCode: ResponseCodes.serverError,
          message: 'Internal Server Error',
        });
      }
    });
  }

  public async getOneSubCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {

        const id = req.params.id;
        const InnerCategoryRepo = getRepository(InnerCategory);

        const data = await InnerCategoryRepo.findOne({
          where: { id: id },
          select: [
            'id',
            'name',
            'image',
            'description',
            'createdAt',
            'updatedAt',
          ],
          relations: ['subcategoryid'],
        });

        if (data) {
          return res.status(ResponseCodes.success).json({
            message: 'SubCategory Fetched Successfully',
            status: true,
            data: data,
          });
        } else {
          return next({
            statusCode: ResponseCodes.userError,
            message: 'SubCategory not found',
          });
        }
      } catch (error) {
        console.error(error);
        return next({
          statusCode: ResponseCodes.serverError,
          message: 'Internal Server Error',
        });
      }
    });
  }

  public async updateSubCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = req.params.id;
        const { name, subcategoryid, description, status } = req.body;

        if (!name || !description || !subcategoryid) {
          return RoutesHandler.sendError(
            res,
            req,
            'All Field Required',
            ResponseCodes.inputError
          );
        }

        const InnerCategoryRepo = getRepository(InnerCategory);

        // Check if the subcategory with the given ID exists
        const existingInnerCategory = await InnerCategoryRepo.findOne({
          where: { id: id },
          select: [
            'id',
            'name',
            'image',
            'description',
            'status',
            'createdAt',
            'updatedAt',
          ],
          relations: ['subcategoryid'],
        });

        if (!existingInnerCategory) {
          return RoutesHandler.sendError(
            res,
            req,
            'SubCategory not found',
            ResponseCodes.userError
          );
        }

        let image: any = [];
        if (req.file) {
          image = await fileService.uploadFile(
            'subcategory',
            req.file.path.replace(/\\/g, '/'),
            req.file.filename
          );
        }

        await InnerCategoryRepo.update(
          { id: existingInnerCategory.id },
          {
            name,
            subcategoryid,
            description,
            status: status !== undefined && status !== null ? parseInt(status) : existingInnerCategory.status,
            image: [image.fileName],
          }
        );
        return res.status(ResponseCodes.success).json({
          message: 'SubCategory updated successfully',
        });
      } catch (error) {
        console.error(error);
        return next({
          statusCode: ResponseCodes.serverError,
          message: 'Internal Server Error',
        });
      }
    });
  }

  public async deleteSubCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = req.params.id;
        const InnerCategoryRepo = getRepository(InnerCategory);

        const categoryToDelete = await InnerCategoryRepo.findOne({
          where: { id: id },
          select: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
        });

        if (!categoryToDelete) {
          return next({
            statusCode: ResponseCodes.userError,
            message: 'Category not found',
          });
        }

        await InnerCategoryRepo.remove(categoryToDelete);

        return res.status(ResponseCodes.success).json({
          message: 'Category deleted successfully',
        });
      } catch (error) {
        console.error(error);
        return next({
          statusCode: ResponseCodes.serverError,
          message: 'Internal Server Error',
        });
      }
    });
  }
}
