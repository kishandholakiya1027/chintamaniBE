import { body, param, query } from "express-validator";

export const Banner_create_validator = [
  body('title').notEmpty().withMessage('title is required').isString(),
  body('description').notEmpty().withMessage('description is required').isString(),
  body('redirectUrl').notEmpty().withMessage('redirectUrl is required').isString()
];

export const Banner_Fetch_validator = [
  query('page').optional(),
  query('pageSize').optional(),
];

export const Banner_Update_validator = [
  body('bannerid').notEmpty().withMessage('bannerid is required').isString(),
];

export const Banner_Remove_validator = [
  param('bannerid').notEmpty().withMessage('bannerid is required').isString(),
];