import * as express from 'express';
import { upload } from '../services/multer';
import { InnerCategoryController } from '../Controller/Categories/InnerCategory';
const Routes = express.Router();

const InnerCategory = new InnerCategoryController();

Routes.post('/create', upload, InnerCategory.InnnerSubCategory);

Routes.get('/getall', InnerCategory.getAllSubCategory);

Routes.get('/get/:id', InnerCategory.getOneSubCategory);

Routes.put('/update/:id', upload, InnerCategory.updateSubCategory);

Routes.delete('/delete/:id', upload, InnerCategory.deleteSubCategory);

export default Routes;
