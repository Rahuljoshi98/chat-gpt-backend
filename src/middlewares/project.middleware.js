import { ErrorResponse } from "../utils/common/index.js";
import { StatusCodes } from "http-status-codes";
import validator from "validator";
import AppError from "../utils/errors/appError.js";

// middlewares/validation.js
export const validateCreateProjectRqst = (req, res, next) => {
  const errorResponse = ErrorResponse();

  const { name } = req.body;
  if (!name) {
    errorResponse.message = "Validation failed while creating Project";
    errorResponse.error = new AppError(
      ["Request data missing."],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
  next();
};

export const validateUpdateProjectRqst = (req, res, next) => {
  const errorResponse = ErrorResponse();

  const { name } = req.body;

  if (name && !name.trim()) {
    errorResponse.message = "Validation failed while updating Project";
    errorResponse.error = new AppError(
      ["Project Name can not be empty."],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (name && !name.trim().length > 100) {
    errorResponse.message = "Validation failed while updating Project";
    errorResponse.error = new AppError(
      ["Project Name can not be greater than 100."],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
  next();
};
