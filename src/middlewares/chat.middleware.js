import { ErrorResponse } from "../utils/common/index.js";
import { StatusCodes } from "http-status-codes";
import validator from "validator";
import AppError from "../utils/errors/appError.js";

// middlewares/validation.js
export const validateMessage = (req, res, next) => {
  const errorResponse = ErrorResponse();

  const { text, attachments } = req.body;
  if (!text && (!attachments || attachments.length === 0)) {
    errorResponse.message = "Validation failed while creating message";
    errorResponse.error = new AppError(
      ["Message text or attachments required."],
      StatusCodes.BAD_REQUEST,
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }
  next();
};
