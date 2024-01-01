import * as express from 'express';
import userRoutes from './UserRoute';
import categoryRoutes from './CategoryRoute';
import subCategoryRoute from './SubCategoryRoute';
import InnnerCategoryRoute from './InnnerCategoryRoute';
import ProductRoute from './Product';
import CartRoute from './Cart';
import WhishlistRoute from './Whishlist';

const Routes = express.Router();

Routes.use('/user', userRoutes);
Routes.use('/category', categoryRoutes);
Routes.use('/subcategory', subCategoryRoute);
Routes.use('/innercategory', InnnerCategoryRoute);
Routes.use('/product', ProductRoute);
Routes.use('/cart', CartRoute);
Routes.use('/whishlist', WhishlistRoute);

export default Routes;
