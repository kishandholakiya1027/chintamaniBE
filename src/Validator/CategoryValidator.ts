import { body, query } from "express-validator";

export const Category_create_validator = [
  body('name').notEmpty().withMessage('Name is required').isString()
];

export const Fetch_Category_To_subcategory_validator = [
  query('page').optional(),
  query('pageSize').optional(),
  query('categoryid').notEmpty().withMessage('categoryid not Found').isUUID(),
];