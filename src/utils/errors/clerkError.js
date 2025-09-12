// utils/errors/handleClerkError.js
import { StatusCodes } from "http-status-codes";
import AppError from "./appError.js";

export const handleClerkError = (error) => {
  const clerkError = error?.errors?.[0];

  if (clerkError) {
    throw new AppError(
      [clerkError.longMessage || clerkError.message],
      StatusCodes.BAD_REQUEST,
    );
  }

  // fallback for non-Clerk errors
  throw new AppError(
    ["Something went wrong with Clerk."],
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
};
