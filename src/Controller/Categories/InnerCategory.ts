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

        // let InnerCategporyimage

        // if (req.file) {
        //   const innercategoryimagesPath = [req.file].map((item: any) => item.path)
        //   InnerCategporyimage = await fileService.uploadFileInS3("InnerCategporyimage", innercategoryimagesPath)
        // }

        let subcategory = {
          name,
          subcategoryid: subcategoryid,
          description,
          image: req.file ? `${process.env.IMAGEBASEURL}/upload/${req.file.filename}`  : null,
        };

        const newSubCategory = InnerCategoryRepo.create(subcategory);

        await InnerCategoryRepo.save(newSubCategory);

        return res.status(ResponseCodes.success).json({
          message: 'InnerCategory created successfully',
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
              message: 'Inner Category can not be fatched',
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

  public async getAllInnerCategory(
    req: any,
    res: Response,
    next
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const InnerCategoryRepo = getRepository(InnerCategory);

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

        const InnerCategoryFindData = await InnerCategoryRepo
          .createQueryBuilder("innerCategory")
          .leftJoinAndSelect("innerCategory.subcategoryid", "subcategory")
          .select()
          .skip((page - 1) * pageSize)
          .take(pageSize)

        const [InnerCategoryData, total] = await InnerCategoryFindData.getManyAndCount()

        if (InnerCategoryData) {

          const responseData = InnerCategoryData.map((innerCategory) => ({
            id: innerCategory.id,
            name: innerCategory.name,
            description: innerCategory.description,
            image: innerCategory.image,
            status: innerCategory.status,
            createdAt: innerCategory.createdAt,
            updatedAt: innerCategory.updatedAt,
            subCategory: innerCategory.subcategoryid.id,
          }));

          return RoutesHandler.sendSuccess(res, req, { responseData, total, page, pageSize }, "Inner Category Fatched Successfully")

        } else {
          return RoutesHandler.sendSuccess(res, req, [], 'Inner Category Not Found');
        }
      } catch (error) {
        return next({
          statusCode: ResponseCodes.serverError,
          message: "Internal Server Error",
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
            'status',
            'description',
            'createdAt',
            'updatedAt',
          ],
          relations: ['subcategoryid'],
        });

        if (data) {
          return res.status(ResponseCodes.success).json({
            message: 'Inner Category Fetched Successfully',
            status: true,
            data: data,
          });
        } else {
          return next({
            statusCode: ResponseCodes.userError,
            message: 'Inner Category not found',
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

        const { name, subcategoryid, description, image, status } = req.body;

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
            'inner Category not found',
            ResponseCodes.userError
          );
        }

        const UpdatedInnerCategory = await InnerCategoryRepo.update(
          { id: existingInnerCategory.id },
          {
            name,
            subcategoryid,
            description,
            status,
            image: image,
          }
        );
        return res.status(ResponseCodes.success).json({
          message: 'inner Category updated successfully',
          data: UpdatedInnerCategory
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
            message: 'Inner Category not found',
          });
        }

        await InnerCategoryRepo.remove(categoryToDelete);

        return res.status(ResponseCodes.success).json({
          message: 'Inner Category deleted successfully',
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
