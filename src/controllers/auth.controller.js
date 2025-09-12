import { StatusCodes } from "http-status-codes";
import { AuthService } from "../services/index.js";
import { SuccessResponse } from "../utils/common/index.js";
import { asyncHandler } from "../utils/helpers/index.js";

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await AuthService.login(req.body);

  const successResponse = SuccessResponse();
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  successResponse.message = "Login Successfull";
  successResponse.data = user;

  return res.status(StatusCodes.OK).send(successResponse);
});

export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  const successResponse = SuccessResponse();
  successResponse.message = "User logged out";

  return res.status(StatusCodes.OK).json(successResponse);
};
