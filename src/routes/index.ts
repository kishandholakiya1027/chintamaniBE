import * as express from "express";
import BannerRoutes from "./Banner";
import BlogRoutes from "./Blog";
import CartRoute from "./Cart";
import categoryRoutes from "./CategoryRoute";
import ClarityRoute from "./Clarity";
import ColorRoute from "./Color";
import ContactRoute from "./Contact";
import CurrencyRoutes from "./Currency";
import CutRoute from "./Cut";
import InnnerCategoryRoute from "./InnnerCategoryRoute";
import OrderRoute from "./Order";
import ProductRoute from "./Product";
import ShapeRoute from "./Shape";
import subCategoryRoute from "./SubCategoryRoute";
import userRoutes from "./UserRoute";
import WhishlistRoute from "./Whishlist";

const Routes = express.Router();

Routes.use("/user", userRoutes);
Routes.use("/category", categoryRoutes);
Routes.use("/subcategory", subCategoryRoute);
Routes.use("/innercategory", InnnerCategoryRoute);
Routes.use("/product", ProductRoute);
Routes.use("/cart", CartRoute);
Routes.use("/whishlist", WhishlistRoute);
Routes.use("/clarity", ClarityRoute);
Routes.use("/cut", CutRoute);
Routes.use("/color", ColorRoute);
Routes.use("/shape", ShapeRoute);
Routes.use("/contact", ContactRoute);
Routes.use("/order", OrderRoute);
Routes.use("/blog", BlogRoutes);
Routes.use("/banner", BannerRoutes);
Routes.use("/currency", CurrencyRoutes);

export default Routes;
