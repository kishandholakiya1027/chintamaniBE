import * as express from 'express';
import { upload } from '../services/multer';
import { InnerCategoryController } from '../Controller/Categories/InnerCategory';
const Routes = express.Router();
import { AUTH } from '../utils/auth';

const InnerCategory = new InnerCategoryController();

Routes.post('/create',AUTH, upload, InnerCategory.InnnerSubCategory);

Routes.get('/getall', InnerCategory.getAllSubCategory);

Routes.get('/getallinnercategory', InnerCategory.getAllInnerCategory);

Routes.get('/get/:id', InnerCategory.getOneSubCategory);

Routes.put('/update/:id',AUTH, upload, InnerCategory.updateSubCategory);

Routes.delete('/delete/:id',AUTH, upload, InnerCategory.deleteSubCategory);

export default Routes;
