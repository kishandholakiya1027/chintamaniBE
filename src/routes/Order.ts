import * as express from 'express';
import { Cteate_Order } from '../Controller/Order/Create_order';
import { order_create_validator } from '../Validator/OrderValidator';
import { AUTH } from '../utils/auth';
const Routes = express.Router();

Routes.post('/create',AUTH, order_create_validator, Cteate_Order);

export default Routes;
