import * as express from 'express';
import { User_create_validator } from '../Validator/UserValidator';
import { UserController } from '../Controller/Users/create_user';
import { AUTH } from '../utils/auth';
import { Login } from '../Controller/Users/login_user';

const Routes = express.Router();
const userController = new UserController();

Routes.post('/create', User_create_validator, userController.CreateUser);

Routes.post('/verification', User_create_validator, userController.VerificationUser);

Routes.post('/resendotp', User_create_validator, userController.SendOtp);

Routes.post('/forgetpassword', User_create_validator, userController.Forget_password);

Routes.post('/verification/forgetpassword', User_create_validator, userController.Verify_Forget_password);

Routes.post('/create_password', AUTH, userController.Create_password);

Routes.post('/change_password', AUTH, userController.Change_password);

Routes.post('/login', Login);

export default Routes;
