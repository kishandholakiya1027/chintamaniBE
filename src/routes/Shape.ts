import * as express from 'express';
import { Cteate_Shape } from '../Controller/shape/create_shape';
import { Remove_Shape } from '../Controller/shape/delete_shape';
import { fetch_Shape } from '../Controller/shape/fetch_shape';
import { Update_Shape } from '../Controller/shape/update_shape';
import { Fetch_Shape_validator, Shape_Remove_validator, Shape_Update_validator, Shape_create_validator } from '../Validator/ShapeValidator';
import { upload } from '../services/multer';
const Routes = express.Router();

Routes.post('/create', upload, Shape_create_validator, Cteate_Shape);

Routes.get('/fetch', Fetch_Shape_validator, fetch_Shape);

Routes.patch('/update', Shape_Update_validator, Update_Shape);

Routes.delete('/delete/:shapeid', Shape_Remove_validator, Remove_Shape);


export default Routes;
