import { body, param, query } from "express-validator";

export const User_create_validator = [
  body('email').notEmpty().withMessage('email is required').isString()
];

export const User_Fetch_validator = [
  query('page').optional(),
  query('pageSize').optional(),
];

export const Remove_admin_validator = [
  param('adminid').notEmpty().withMessage('adminid is required')
];

export const User_Update_validator = [
  body('userid').notEmpty().withMessage('userid is required').isString()
];