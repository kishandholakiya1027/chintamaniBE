import * as express from 'express';
import { Blog_create_validator, Blog_Update_validator, Blog_Remove_validator, Blog_Fetch_validator } from '../Validator/BlogValidator';
import { Create_Blog } from '../Controller/Blog/create_blog';
import { fetch_All_Blog, fetch_Blog } from '../Controller/Blog/fetch_blog';
import { Update_Blog } from '../Controller/Blog/update_blog';
import { Remove_Blog } from '../Controller/Blog/delete_blog';
import { upload } from '../services/multer';
import { AUTH } from '../utils/auth';

const Routes = express.Router();

Routes.post('/create', AUTH, upload, Blog_create_validator, Create_Blog);

Routes.get('/fetch/:blogid', fetch_Blog);

Routes.get('/fetch', Blog_Fetch_validator, fetch_All_Blog);

Routes.patch('/update', AUTH, upload, Blog_Update_validator, Update_Blog);

Routes.delete('/delete/:blogid', AUTH, Blog_Remove_validator, Remove_Blog);

export default Routes;
