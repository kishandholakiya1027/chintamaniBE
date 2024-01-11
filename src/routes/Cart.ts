import * as express from 'express';
import { CartController } from '../Controller/Cart/cart';
import { Create_Cart_validator, Fetch_Cart_validator, Update_Cart_validator } from '../Validator/CartValidator';
import { AUTH } from '../utils/auth';
const Routes = express.Router();

const AddToCartController = new CartController();

Routes.post(
    "/create",
    AUTH,
    Create_Cart_validator,
    AddToCartController.CreateCart
);

Routes.post(
    "/update",
    AUTH,
    Update_Cart_validator,
    AddToCartController.UpdateQuentity
);

Routes.get(
    "/fetch/:userid",
    AUTH,
    Fetch_Cart_validator,
    AddToCartController.GetCart
);

Routes.post(
    "/remove",
    AUTH,
    Create_Cart_validator,
    AddToCartController.RemoveCart
);

export default Routes;