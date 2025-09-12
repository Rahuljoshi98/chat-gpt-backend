import { ErrorResponse } from "../utils/common/index.js";
import { StatusCodes } from "http-status-codes";
import validator from "validator";
import AppError from "../utils/errors/appError.js";

export const validateCreateUser = (req, res, next) => {
  const { firstName, email, password } = req.body;
  const errorResponse = ErrorResponse();

  if (!firstName || !email || !password) {
    errorResponse.message = "Validation failed while creating user";
    errorResponse.error = new AppError(
      ["Missing required fields: firstName, email, or password"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (!validator.isEmail(email)) {
    errorResponse.message = "Validation failed while creating user";
    errorResponse.error = new AppError(
      ["Invalid email format"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (password.length < 6) {
    errorResponse.message = "Validation failed while creating user";
    errorResponse.error = new AppError(
      ["Password must be at least 6 characters"],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  next();
};
