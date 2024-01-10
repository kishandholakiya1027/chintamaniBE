import { body, query } from "express-validator";

export const User_create_validator = [
  body('email').notEmpty().withMessage('email is required').isString()
];

export const User_Fetch_validator = [
  query('page').optional(),
  query('pageSize').optional(),
];