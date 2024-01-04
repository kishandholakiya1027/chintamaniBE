import * as express from 'express';
import { SubCategoryController } from '../Controller/Categories/subCategory';
import { upload } from '../services/multer';
import { Fetch_SubCategory_To_Innercategory_validator } from '../Validator/SubCategoryValidator';

const Routes = express.Router();
const subCategoryController = new SubCategoryController();

Routes.post('/create', upload, subCategoryController.CreateSubCategory);

Routes.get('/getall', subCategoryController.getAllSubCategory);

Routes.get("/getallSubCategories", subCategoryController.getAllSubCategories);

Routes.get('/innercategory', Fetch_SubCategory_To_Innercategory_validator, subCategoryController.GetSubcategory_To_InnerCategory);

Routes.get('/get/:id', subCategoryController.getOneSubCategory);

Routes.put('/update/:id', upload, subCategoryController.updateSubCategory);

Routes.delete('/delete/:id', upload, subCategoryController.deleteSubCategory);

export default Routes;
