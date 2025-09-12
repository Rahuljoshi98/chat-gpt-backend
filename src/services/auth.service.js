import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../repository/index.js";
import AppError from "../utils/errors/appError.js";

export const login = async (data) => {
  try {
    const { email, password } = data;
    const user = await UserRepository.findOneWithPassword({ email });
    if (!user) {
      throw new AppError(["User not found"], StatusCodes.NOT_FOUND);
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new AppError(
        ["Email or password is wrong"],
        StatusCodes.BAD_REQUEST,
      );
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.clerkId;

    if (!accessToken) {
      throw new AppError(
        ["Something went wrong while login"],
        StatusCodes.NOT_FOUND,
      );
    }
    return {
      accessToken,
      refreshToken,
      user: userObj,
    };
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      ["Something went wrong while login"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
