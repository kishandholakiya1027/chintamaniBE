import * as express from 'express';
import userRoutes from './UserRoute';
import categoryRoutes from './CategoryRoute';
import subCategoryRoute from './SubCategoryRoute';
import InnnerCategoryRoute from './InnnerCategoryRoute';
import ProductRoute from './Product';
import CartRoute from './Cart';
import WhishlistRoute from './Whishlist';
import ClarityRoute from './Clarity';
import CutRoute from './Cut';
import ColorRoute from './Color';
import ShapeRoute from './Shape';

const Routes = express.Router();

Routes.use('/user', userRoutes);
Routes.use('/category', categoryRoutes);
Routes.use('/subcategory', subCategoryRoute);
Routes.use('/innercategory', InnnerCategoryRoute);
Routes.use('/product', ProductRoute);
Routes.use('/cart', CartRoute);
Routes.use('/whishlist', WhishlistRoute);
Routes.use('/clarity', ClarityRoute);
Routes.use('/cut', CutRoute);
Routes.use('/color', ColorRoute);
Routes.use('/shape', ShapeRoute);

export default Routes;
