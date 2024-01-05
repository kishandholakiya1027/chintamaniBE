import * as express from 'express';
import { Cteate_Clarity } from '../Controller/Clarity/create_clarity';
import { Remove_Clarity } from '../Controller/Clarity/delete_clarity';
import { fetch_Clarity } from '../Controller/Clarity/fetch_clarity';
import { Update_Clarity } from '../Controller/Clarity/update_clarity';
import { AUTH } from '../utils/auth';

import { Clarity_Remove_validator, Clarity_Update_validator, Clarity_create_validator, Fetch_clarity_validator } from '../Validator/ClarityValidator';
const Routes = express.Router();

Routes.post('/create',AUTH, Clarity_create_validator, Cteate_Clarity);

Routes.get('/fetch', Fetch_clarity_validator, fetch_Clarity);

Routes.patch('/update',AUTH, Clarity_Update_validator, Update_Clarity);

Routes.delete('/delete/:clarityid',AUTH, Clarity_Remove_validator, Remove_Clarity);

export default Routes;
