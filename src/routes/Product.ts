import * as express from 'express';
import { ProductController } from '../Controller/Product/product';
import { delete_product_validator, fetch_product_create_validator, product_create_validator, update_product_validator } from '../Validator/ProductValidator';
import { Productmultiplefile, upload } from '../services/multer';
import { AUTH } from '../utils/auth';


const Routes = express.Router();
const ProductControllers = new ProductController();

Routes.post('/create', AUTH, Productmultiplefile, ProductControllers.CreateProduct);

Routes.get('/product', fetch_product_create_validator, ProductControllers.fetchProduct);

Routes.post('/updatefile', upload, ProductControllers.UpdateFile);

Routes.patch('/update', AUTH, update_product_validator, ProductControllers.UpdateProduct);

Routes.delete('/delete/:productId', AUTH, delete_product_validator, ProductControllers.DeleteProduct);

export default Routes;
