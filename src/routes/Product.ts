import * as express from 'express';
import { ProductController } from '../Controller/Product/product';
import { delete_product_validator, fetch_product_create_validator, product_create_validator, update_product_validator } from '../Validator/ProductValidator';
import { Productmultiplefile, upload } from '../services/multer';

const Routes = express.Router();
const ProductControllers = new ProductController();

Routes.post('/create', Productmultiplefile, ProductControllers.CreateProduct);

Routes.get('/product', fetch_product_create_validator, ProductControllers.fetchProduct);

Routes.post('/updatefile', upload, ProductControllers.UpdateFile);

Routes.patch('/update', update_product_validator, ProductControllers.UpdateProduct);

Routes.delete('/delete/:productId', delete_product_validator, ProductControllers.DeleteProduct);

export default Routes;
