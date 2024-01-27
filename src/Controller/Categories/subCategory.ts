import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { FileService } from '../../services/backblaze-upload';
import { ResponseCodes } from '../../utils/response-codes';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { SubCategory } from '../../entities/SubCategoryModel';
import { InnerCategory } from '../../entities/InnerCategoryModel';
const fileService = new FileService();

export class SubCategoryController {
  constructor() { }

  public async CreateSubCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, categoryid, description } = req.body;
        if (!name || !description || !categoryid) {
          return RoutesHandler.sendError(
            res,
            req,
            'All Field Required',
            ResponseCodes.inputError
          );
        }
        const subCategoryRepo = getRepository(SubCategory);

        let subcategoryimage

        if (req.file) {
          const subcategoryimagesPath = [req.file].map((item: any) => item.path)
          subcategoryimage = await fileService.uploadFileInS3("subcategory", subcategoryimagesPath)
        }

        let subcategory = {
          name,
          categoryid: categoryid,
          description,
          image: subcategoryimage ? subcategoryimage[0]?.fileName : null,
        };

        const newSubCategory = subCategoryRepo.create(subcategory);

        await subCategoryRepo.save(newSubCategory);

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

  public async GetSubcategory_To_InnerCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          console.log(errors, "errors")
          return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
        }

        const { subcategoryid } = req.query

        if (!subcategoryid) {
          return RoutesHandler.sendError(res, req, "Category Id Not Found", ResponseCodes.inputError);
        }

        const InnerCategoryRepo = getRepository(InnerCategory);

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

        const qurey = InnerCategoryRepo.createQueryBuilder('innercategory')
          .select()

        if (subcategoryid) {
          qurey.where('innercategory.subcategoryid = :subcategoryid ', { subcategoryid })
        }
        qurey.skip((page - 1) * pageSize)
        qurey.take(pageSize)

        const [innercategories, total] = await qurey.getManyAndCount()
        if (!innercategories || innercategories.length === 0) {
          return RoutesHandler.sendSuccess(res, req, [], 'Inner Category Not Found');
        }

        return RoutesHandler.sendSuccess(res, req, { innercategories, total, page, pageSize }, "Inner Categories Found Successfully")


      } catch (error) {
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    });
  }

  public async getAllSubCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const subCategoryRepo = getRepository(SubCategory);
        await subCategoryRepo
          .find({ relations: ['categoryid'] })
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


  public async getAllSubCategories(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const subCategoryRepo = getRepository(SubCategory);

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

        const subCategories = await subCategoryRepo
          .createQueryBuilder("subCategory")
          .leftJoinAndSelect("subCategory.categoryid", "category")
          .select()
          .skip((page - 1) * pageSize)
          .take(pageSize)

        const [SubCategoryData, total] = await subCategories.getManyAndCount()

        const responseData = SubCategoryData.map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          description: subCategory.description,
          image: subCategory.image,
          status: subCategory.status,
          createdAt: subCategory.createdAt,
          updatedAt: subCategory.updatedAt,
          category: subCategory.categoryid.id,
        }));

        return RoutesHandler.sendSuccess(res, req, { responseData, total, page, pageSize }, "SubCategory Fetched Successfully")
      } catch (error) {
        console.error(error);

        return next({
          statusCode: ResponseCodes.saveError,
          message: "SubCategory cannot be fetched",
        });
      }
    });
  }


  public async getOneSubCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = req.params.id;
        const subCategoryRepo = getRepository(SubCategory);

        const data = await subCategoryRepo.findOne({
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
          relations: ['categoryid'],
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
        const { name, categoryid, description, image, status } = req.body;

        const subCategoryRepo = getRepository(SubCategory);

        // Check if the subcategory with the given ID exists
        const existingSubCategory = await subCategoryRepo.findOne({
          where: { id: id },
        });

        if (!existingSubCategory) {
          return RoutesHandler.sendError(
            res,
            req,
            'SubCategory not found',
            ResponseCodes.userError
          );
        }

        const UpdatedSUbcategory = await subCategoryRepo.update(
          { id: existingSubCategory.id },
          {
            name,
            categoryid,
            description,
            image: image,
            status
          }
        );
        return res.status(ResponseCodes.success).json({
          message: 'SubCategory updated successfully',
          data : UpdatedSUbcategory
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
        const categoryRepo = getRepository(SubCategory);

        const categoryToDelete = await categoryRepo.findOne({
          where: { id: id },
          select: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
        });

        if (!categoryToDelete) {
          return next({
            statusCode: ResponseCodes.userError,
            message: 'Category not found',
          });
        }

        await categoryRepo.remove(categoryToDelete);

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
