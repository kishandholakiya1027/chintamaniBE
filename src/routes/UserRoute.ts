import * as express from 'express';
import { User_create_validator } from '../Validator/UserValidator';
import { UserController } from '../Controller/Users/create_user';
const Routes = express.Router();
const userController = new UserController();

Routes.post('/create', User_create_validator, userController.CreateUser);

export default Routes;
