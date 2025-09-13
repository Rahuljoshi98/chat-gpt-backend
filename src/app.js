import express from "express";
import cookieParser from "cookie-parser";
import { ErrorResponse } from "./utils/common/index.js";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import routes from "./routes/index.js";
import { StatusCodes } from "http-status-codes";

const app = express();

// 🔹 CORS must be first
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://chat-gpt-frontend-chi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // allow cookies
  }),
);

// 🔹 Core middlewares
app.use(express.json());
app.use(cookieParser());

// 🔹 Clerk with cookieOptions to fix SameSite issues
app.use(
  clerkMiddleware({
    cookieOptions: {
      sameSite: "none", // required for cross-site
      secure: true, // required since Railway is HTTPS
    },
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// 🔹 Routes
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

// ✅ Export app
export { app };
