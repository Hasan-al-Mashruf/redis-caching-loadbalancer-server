import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./app/middleware/errorHandler.js";
import createError from "./app/utils/throwError.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/error", (req, res, next) => {
  next(createError("Checking global error middleware", 400));
});

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "hello world" });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
