import express from "express";
import cookieParser from "cookie-parser";
import { ErrorResponse } from "./utils/common/index.js";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import routes from "./routes/index.js";
import { StatusCodes } from "http-status-codes";

const app = express();

// 🔹 CORS first
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://chat-gpt-frontend-chi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // 👈 allow auth header
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// 🔹 Clerk middleware (works with Bearer tokens too)
app.use(clerkMiddleware());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// 🔹 Debug route
app.get("/whoami", (req, res) => {
  const { userId, sessionId } = req.auth || {};
  res.json({ userId, sessionId });
});

// 🔹 Mount routes
app.use("/", routes);

// 🔹 Error handler
app.use((err, req, res, next) => {
  const errorResponse = ErrorResponse();
  errorResponse.error = err;
  errorResponse.message = err.message || "Something went wrong";

  return res
    .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(errorResponse);
});

// 🔹 Health check
app.get("/", (req, res) => {
  return res.status(200).send("server is running");
});

export { app };
