import { body, param, query } from "express-validator";

export const Blog_create_validator = [
  body('title').notEmpty().withMessage('title is required').isString(),
  body('author').notEmpty().withMessage('author is required').isString(),
  body('description').notEmpty().withMessage('description is required').isString(),
  body('heading').notEmpty().withMessage('heading is required').isString()
];

export const Blog_Fetch_validator = [
  query('page').optional(),
  query('pageSize').optional(),
];

export const Blog_Update_validator = [
  body('blogid').notEmpty().withMessage('blogid is required').isString(),
];

export const Blog_Remove_validator = [
  param('blogid').notEmpty().withMessage('blogid is required').isString(),
];