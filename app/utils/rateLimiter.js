import { rateLimit } from "express-rate-limit";
import createError from "./createError.js";
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 5, // Limit each IP to 5 requests per `window`
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(createError("Too many requests, please try again later.", 429));
  },
});

export default limiter;
