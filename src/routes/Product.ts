import * as express from 'express';
import { ProductController } from '../Controller/Product/product';
import { delete_product_validator, fetch_product_create_validator, fetch_trending_diamonds_product_create_validator, product_create_validator, update_product_validator } from '../Validator/ProductValidator';
import { Productmultiplefile, insert_product, upload } from '../services/multer';
import { AUTH } from '../utils/auth';
import { Create_bulk_Product } from '../Controller/Product/create_bulk_product';
import { Trading_Product } from '../Controller/Product/Trending_Product';


const Routes = express.Router();
const ProductControllers = new ProductController();

Routes.post('/create', AUTH, Productmultiplefile, ProductControllers.CreateProduct);

Routes.post('/create/bulk_product', AUTH, insert_product, Create_bulk_Product);

Routes.get('/product', fetch_product_create_validator, ProductControllers.fetchProduct);

Routes.get('/trending/diamonds', fetch_trending_diamonds_product_create_validator, Trading_Product);

Routes.get('/single/product/:productId', delete_product_validator, ProductControllers.single_fetchProduct);

Routes.post('/updatefile', upload, ProductControllers.UpdateFile);

Routes.patch('/update', AUTH, update_product_validator, ProductControllers.UpdateProduct);

Routes.delete('/delete/:productId', AUTH, delete_product_validator, ProductControllers.DeleteProduct);

export default Routes;
