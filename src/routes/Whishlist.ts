import * as express from 'express';
import { AUTH } from '../utils/auth';
import { WhishlistController } from '../Controller/WhishList/whishlist';
import { Create_Whishlist_validator, Fetch_Whishlist_validator } from '../Validator/WhishlistValidator';
const Routes = express.Router();

const AddToWhishlistController = new WhishlistController();

Routes.post(
    "/create",
    AUTH,
    Create_Whishlist_validator,
    AddToWhishlistController.CreateWhishlist
);

Routes.get(
    "/fetch/:userid",
    AUTH,
    Fetch_Whishlist_validator,
    AddToWhishlistController.GetWhishlist
);

Routes.post(
    "/remove",
    AUTH,
    Create_Whishlist_validator,
    AddToWhishlistController.RemoveWhishlist
);

export default Routes;