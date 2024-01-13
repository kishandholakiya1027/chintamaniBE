import * as express from 'express';
import { Cteate_Order } from '../Controller/Order/Create_order';
import { getAllOrders } from '../Controller/Order/Fetch_order';
import { order_create_validator, order_fetch_validator, single_order_validator, update_single_order_validator } from '../Validator/OrderValidator';
import { AUTH } from '../utils/auth';
import { Fetch_single_Orders } from '../Controller/Order/fetch_single_order';
import { Update_Order_status } from '../Controller/Order/Update_Order_status';
const Routes = express.Router();

Routes.post('/create', AUTH, order_create_validator, Cteate_Order);

Routes.get('/getall', AUTH, order_fetch_validator, getAllOrders);

Routes.get('/single/:orderid', AUTH, single_order_validator, Fetch_single_Orders);

Routes.patch('/update', AUTH, update_single_order_validator, Update_Order_status);

export default Routes;
