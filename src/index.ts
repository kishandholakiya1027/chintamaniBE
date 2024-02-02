import express, { Request, Response } from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import Routes from './routes/index';
import bodyparser from 'body-parser'
import cors from "cors";
import path from "path";
import { databaseConfig } from './config/database.config';
import { CreateAdmin } from './utils/Admin';
dotenv.config();

const app = express();
const port = 3005 || 4001;

app.use(cors());
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())


app.use('/api/v1', Routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Stage Server Running');
});

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: false
    },
  });
};

app.use(errorHandler);

createConnection(databaseConfig)
  .then(async () => {
    CreateAdmin({})
    app.listen(port, () => {
      console.log(`Server Start on http://localhost:${port},
Database Connected successfully`);
    });
  });

