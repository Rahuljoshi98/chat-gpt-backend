import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../utils/common/index.js";
import validator from "validator";
import AppError from "../utils/errors/appError.js";
import { UserRepository } from "../repository/index.js";
import { getAuth } from "@clerk/express";

/**
 * Middleware to validate login request payload
 */
export const validateLoginRqst = async (req, res, next) => {
  const { email = "", password = "" } = req.body;
  const errorResponse = ErrorResponse();

  if (!email.trim() || !password.trim()) {
    errorResponse.message = "Login validation failed";
    errorResponse.error = new AppError(
      ["Email and password are required"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (!validator.isEmail(email)) {
    errorResponse.message = "Login validation failed";
    errorResponse.error = new AppError(
      ["Invalid email format"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  next();
};

export const authenticateUser = async (req, res, next) => {
  const errorResponse = ErrorResponse();

  try {
    // Clerk parses session automatically
    const { userId } = getAuth(req);
    // const userId = "user_32Z19l9wQ6uMlD62SsI2B3zFhoQ";

    if (!userId) {
      errorResponse.message = "Unauthorized Request";
      errorResponse.error = new AppError(
        ["Authentication failed. Please login first"],
        StatusCodes.UNAUTHORIZED,
      );
      return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
    }

    // 🔹 Optional: sync with your DB
    const user = await UserRepository.find({ clerkId: userId });
    if (!user) {
      errorResponse.message = "Authentication failed";
      errorResponse.error = new AppError(
        ["User not found in database"],
        StatusCodes.BAD_REQUEST,
      );
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    req.user = user; // attach to request
    next();
  } catch (err) {
    console.error("Clerk verify error:", err.message);
    errorResponse.message = "Authentication failed";
    errorResponse.error = new AppError([err.message], StatusCodes.UNAUTHORIZED);
    return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
  }
};
