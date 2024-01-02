import * as express from 'express';
import { Color_Remove_validator, Color_Update_validator, Color_create_validator, Fetch_Color_validator } from '../Validator/ColorValidator';
import { Cteate_Color } from '../Controller/Color/create_color';
import { fetch_Color } from '../Controller/Color/fetch_color';
import { Update_Color } from '../Controller/Color/update_color';
import { Remove_Color } from '../Controller/Color/delete_color';
const Routes = express.Router();

Routes.post('/create', Color_create_validator, Cteate_Color);

Routes.get('/fetch', Fetch_Color_validator, fetch_Color);

Routes.patch('/update', Color_Update_validator, Update_Color);

Routes.delete('/delete/:colorid', Color_Remove_validator, Remove_Color);

export default Routes;
