import * as express from 'express';
import { Cteate_Order } from '../Controller/Order/Create_order';
import { order_create_validator } from '../Validator/OrderValidator';
const Routes = express.Router();

Routes.post('/create', order_create_validator, Cteate_Order);

export default Routes;
