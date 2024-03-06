import axios from "axios";
import bodyparser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { databaseConfig } from "./config/database.config";
import { CurrencyPrice } from "./entities/currencyPriceModel";
import Routes from "./routes/index";
import { CreateAdmin } from "./utils/Admin";
const cron = require("node-cron");
dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
app.use("/upload", express.static("uploads"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use("/api/v1", Routes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Stage Server Running");
});

cron.schedule("17 4 * * *", async () => {
  try {
    const apiEndpoint =
      "https://api.currencyapi.com/v3/latest?apikey=cur_live_NSEHGxhYeb9U2Nr27reE6KBqDe6rLUrRPHLbzLsn";

    // Make the API call
    const response = await axios.get(apiEndpoint);

    // Check if the API call was successful

    if (response.status !== 200) {
      throw new Error("API call failed");
    }

    const currencyPrice = getRepository(CurrencyPrice);

    const data = response.data.data;

    for (const currencyCode in data) {
      const currency = data[currencyCode];

      const existingCurrency = await currencyPrice.findOne({
        where: {
          code: currency.code,
        },
      });

      if (existingCurrency) {
        existingCurrency.value = currency.value.toFixed(7);

        await currencyPrice.save(existingCurrency);
      } else {
        const query = currencyPrice.create({
          code: currency.code,
          value: currency.value.toFixed(7),
        });

        await currencyPrice.save(query);
      }
    }
  } catch (error) {
    console.error("Error making API call:", error.message);
  }
});

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: false,
    },
  });
};

app.use(errorHandler);

createConnection(databaseConfig).then(async () => {
  CreateAdmin({});
  app.listen(port, () => {
    console.log(`Server Start on http://localhost:${port},
Database Connected successfully`);
  });
});
