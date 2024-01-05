import * as express from 'express';
import { Create_Banner } from '../Controller/Banner/create_banner';
import { fetch_All_Banner, fetch_Banner } from '../Controller/Banner/fetch_Banner';
import { Update_Banner } from '../Controller/Banner/update_Banner';
import { Remove_Banner } from '../Controller/Banner/delete_Banner';
import { upload } from '../services/multer';
import { Banner_Fetch_validator, Banner_Remove_validator, Banner_Update_validator, Banner_create_validator } from '../Validator/BannerValidator';
import { AUTH } from '../utils/auth';

const Routes = express.Router();

Routes.post('/create', AUTH, upload, Banner_create_validator, Create_Banner);

Routes.get('/fetch/:bannerid', fetch_Banner);

Routes.get('/fetch', Banner_Fetch_validator, fetch_All_Banner);

Routes.patch('/update', AUTH, upload, Banner_Update_validator, Update_Banner);

Routes.delete('/delete/:bannerid', Banner_Remove_validator, AUTH, Remove_Banner);

export default Routes;
