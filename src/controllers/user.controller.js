import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/index.js";
import { SuccessResponse } from "../utils/common/index.js";
import { asyncHandler } from "../utils/helpers/index.js";

export const createUser = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();

  const user = await UserService.createUser(req.body);

  return res.status(StatusCodes.CREATED).json(successResponse);
});
