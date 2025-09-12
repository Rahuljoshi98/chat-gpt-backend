import express from "express";
import cookieParser from "cookie-parser";
import { ErrorResponse } from "./utils/common/index.js";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";

const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(clerkMiddleware());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://chat-gpt-frontend-chi.vercel.app",
    ],
    credentials: true,
  }),
);

// import routes
import routes from "./routes/index.js";
import { StatusCodes } from "http-status-codes";

// mount routes
app.use("/", routes);

app.use((err, req, res, next) => {
  const errorResponse = ErrorResponse();
  errorResponse.error = err;
  errorResponse.message = err.message || "Something went wrong";

  return res
    .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(errorResponse);
});

app.get("/", (req, res) => {
  return res.status(200).send("server is running");
});

// ✅ Export app
export { app };
