import * as express from 'express';
import { CategoryController } from '../Controller/Categories/category';
import { User_create_validator } from '../Validator/UserValidator';
import { Category_create_validator, Fetch_Category_To_subcategory_validator } from '../Validator/CategoryValidator';
import { upload } from '../services/multer';
const Routes = express.Router();

const categoryController = new CategoryController();

Routes.post('/create', upload, Category_create_validator, categoryController.CreateCategory);

Routes.get('/getall', categoryController.getAllCategory);

Routes.get('/subcategory', Fetch_Category_To_subcategory_validator, categoryController.getCategory_To_Subcategory);

Routes.get('/get/:id', categoryController.getOneCategory);

Routes.put('/update/:id', categoryController.updateCategory);

Routes.delete('/delete/:id', categoryController.deleteCategory);

export default Routes;
