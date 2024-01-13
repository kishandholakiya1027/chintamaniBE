import * as express from 'express';
import { Remove_admin_validator, User_Fetch_validator, User_Update_validator, User_create_validator, fetch_single_User_Update_validator } from '../Validator/UserValidator';
import { UserController } from '../Controller/Users/create_user';
import { AUTH } from '../utils/auth';
import { Login } from '../Controller/Users/login_user';
import { Fetch_Active_User } from '../Controller/Users/fetch_user';
import { Assing_Admin } from '../Controller/Users/AssingAdmin';
import { Remove_Admin } from '../Controller/Users/Remove_Admin';
import { Fetch_Active_Admin } from '../Controller/Users/Fetch_Admin';
import { Update_User } from '../Controller/Users/Update_User_Profile';
import { Logout_User } from '../Controller/Users/Logout';
import { Fetch_single_Active_User } from '../Controller/Users/single_user';

const Routes = express.Router();
const userController = new UserController();

Routes.post('/create', User_create_validator, userController.CreateUser);

Routes.patch('/update', User_Update_validator, Update_User);

Routes.post('/verification', User_create_validator, userController.VerificationUser);

Routes.post('/resendotp', User_create_validator, userController.SendOtp);

Routes.post('/forgetpassword', User_create_validator, userController.Forget_password);

Routes.post('/verification/forgetpassword', User_create_validator, userController.Verify_Forget_password);

Routes.post('/create_password', AUTH, userController.Create_password);

Routes.post('/change_password', AUTH, userController.Change_password);

Routes.post('/login', Login);

Routes.get('/userlist', AUTH, User_Fetch_validator, Fetch_Active_User);

Routes.post('/assing/admin', User_create_validator, Assing_Admin);

Routes.patch('/remove/admin/:adminid', Remove_admin_validator, Remove_Admin);

Routes.get('/admin', Fetch_Active_Admin);

Routes.post('/logout', AUTH, User_Update_validator, Logout_User);

Routes.get('/fetch_user/:userid', AUTH, fetch_single_User_Update_validator, Fetch_single_Active_User);

export default Routes;
