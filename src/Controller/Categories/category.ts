import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Category } from '../../entities/CategoryModel';
import { validationResult } from 'express-validator';
import { FileService } from '../../services/backblaze-upload';
import { ResponseCodes } from '../../utils/response-codes';
import { RoutesHandler } from '../../utils/ErrorHandler';
import { SubCategory } from '../../entities/SubCategoryModel';
import { InnerCategory } from '../../entities/InnerCategoryModel';
const fileService = new FileService();
export class CategoryController {
  constructor() { }

  public async CreateCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
        }

        const { name, description } = req.body;

        const CategoryRepo = getRepository(Category);

        if (!name) {
          return RoutesHandler.sendError(res, req, 'Name Is Required', ResponseCodes.inputError);
        }

        const category = await CategoryRepo.createQueryBuilder('category')
          .where('category.name = :name ', { name })
          .getOne();

        if (!category) {

          let categoryimage

          if (req.file) {
            const categoryimagesPath = [req.file].map((item: any) => item.path)
            categoryimage = await fileService.uploadFileInS3("categoryimage", categoryimagesPath)
          }

          const CategoryData = await CategoryRepo.create({
            name: name,
            description: description,
            image: categoryimage ? categoryimage[0]?.fileName : null
          });

          CategoryRepo.save(CategoryData)
            .then((data) => {
              return RoutesHandler.sendSuccess(res, req, data, "Category Created Successfully")
            })
            .catch((err) => {
              console.log(err);
              return RoutesHandler.sendError(res, req, 'Category Create Some Error', ResponseCodes.saveError);
            });

        } else {
          return RoutesHandler.sendError(res, req, 'Category Already Exist', ResponseCodes.inputError);
        }
      } catch (error) {
        console.log(error, "Error")
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    });
  }

  public async getAllCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const CategoryRepo = getRepository(Category);
        const SubCategoryRepo = getRepository(SubCategory);
        const InnerCategoryRepo = getRepository(InnerCategory);

        const categories = await CategoryRepo.createQueryBuilder('category').getMany();

        const modifiedCategories = [];

        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];

          const subCategories = await SubCategoryRepo.createQueryBuilder('subcategory')
            .where('subcategory.categoryid = :categoryid', { categoryid: category.id })
            .getMany();

          const modifiedSubCategories = [];

          for (let j = 0; j < subCategories.length; j++) {
            const subcategory = subCategories[j];

            const innerCategories = await InnerCategoryRepo.createQueryBuilder('innercategory')
              .where('innercategory.subcategoryid = :subcategoryid', { subcategoryid: subcategory.id })
              .getMany();

            modifiedSubCategories.push({ ...subcategory, innerCategories });
          }

          modifiedCategories.push({ ...category, subCategories: modifiedSubCategories });
        }

        if (!modifiedCategories || modifiedCategories.length === 0) {
          return RoutesHandler.sendError(res, req, 'Category Not Found', ResponseCodes.success);
        }

        return RoutesHandler.sendSuccess(res, req, modifiedCategories, 'Categories fetched Successfully');
      } catch (error) {
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    });
  }


  public async getCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const CategoryRepo = getRepository(Category);
        const SubCategoryRepo = getRepository(SubCategory);

        const categories =
          await CategoryRepo.createQueryBuilder("category").getMany();

        const modifiedCategories = [];

        for (let i = 0; i < categories.length; i++) {
          const category = categories[i];

          const subCategories = await SubCategoryRepo.createQueryBuilder(
            "subcategory"
          )
            .select(["subcategory.id"])
            .where("subcategory.categoryid = :categoryid", {
              categoryid: category.id,
            })
            .getMany();

          modifiedCategories.push({
            id: category.id,
            name: category.name,
            description: category.description,
            image: category.image,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            subcategory: subCategories.length > 0 ? subCategories[0].id : null,
          });
        }

        if (!modifiedCategories || modifiedCategories.length === 0) {
          return RoutesHandler.sendError(
            res,
            req,
            "Category Not Found",
            ResponseCodes.success
          );
        }

        return RoutesHandler.sendSuccess(
          res,
          req,
          modifiedCategories,
          "Categories fetched Successfully"
        );
      } catch (error) {
        return RoutesHandler.sendError(
          res,
          req,
          "Internal Server Error",
          ResponseCodes.serverError
        );
      }
    });
  }


  public async getCategory_To_Subcategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          console.log(errors, "errors")
          return RoutesHandler.sendError(res, req, errors.array(), ResponseCodes.inputError);
        }

        const { categoryid } = req.query

        const SubCategoryRepo = getRepository(SubCategory);

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

        const qurey = SubCategoryRepo.createQueryBuilder('subcategory')
          .select()

        if (categoryid) {
          qurey.where('subcategory.categoryid = :categoryid ', { categoryid })
        }
        qurey.skip((page - 1) * pageSize)
        qurey.take(pageSize)

        const [categories, total] = await qurey.getManyAndCount()
        if (!categories || categories.length === 0) {
          return RoutesHandler.sendSuccess(res, req, [], 'SubCategory Not Found');
        }

        return RoutesHandler.sendSuccess(res, req, { categories, total, page, pageSize }, "Category Created Successfully")

      } catch (error) {
        return RoutesHandler.sendError(res, req, 'Internal Server Error', ResponseCodes.serverError);
      }
    });
  }

  public async getOneCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = req.params.id;
        const categoryRepo = getRepository(Category);

        const data = await categoryRepo.findOne({
          where: { id: id },
          select: ['id', 'name', 'description', 'createdAt', 'updatedAt'],
        });
        if (data) {
          return res.status(ResponseCodes.success).json({
            message: 'Category Fetched Successfully',
            status: true,
            data: data,
          });
        } else {
          return next({
            statusCode: ResponseCodes.userError,
            message: 'Category not found',
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

  public async updateCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = req.params.id;

        const { name, description, image } = req.body;

        const categoryRepo = getRepository(Category);

        const categoryToUpdate = await categoryRepo.findOne({
          where: { id: id },
        });

        if (!categoryToUpdate) {
          return next({
            statusCode: ResponseCodes.userError,
            message: 'Category not found',
          });
        }

        categoryToUpdate.name = name || categoryToUpdate.name;
        categoryToUpdate.description = description || categoryToUpdate.description;
        categoryToUpdate.image = image || categoryToUpdate.image;

        await categoryRepo.save(categoryToUpdate);

        return res.status(ResponseCodes.success).json({
          message: 'Category updated successfully',
          data: categoryToUpdate,
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

  public async deleteCategory(req: any, res: Response, next): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const id = req.params.id;
        const categoryRepo = getRepository(Category);

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
