import * as express from 'express';
import { Cut_Remove_validator, Cut_Update_validator, Cut_create_validator, Fetch_Cut_validator } from '../Validator/CutValidator';
import { Cteate_Cut } from '../Controller/Cut/create_cut';
import { fetch_Cut } from '../Controller/Cut/fetch_cut';
import { Update_Cut } from '../Controller/Cut/update_cut';
import { Remove_Cut } from '../Controller/Cut/delete_cut';
const Routes = express.Router();

Routes.post('/create', Cut_create_validator, Cteate_Cut);

Routes.get('/fetch', Fetch_Cut_validator, fetch_Cut);

Routes.patch('/update', Cut_Update_validator, Update_Cut);

Routes.delete('/delete/:cutid', Cut_Remove_validator, Remove_Cut);

export default Routes;
