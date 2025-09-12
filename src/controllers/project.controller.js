import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../utils/common/index.js";
import { asyncHandler } from "../utils/helpers/index.js";
import { ProjectService } from "../services/index.js";

export const createProject = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;
  const { name, description = "" } = req.body;

  const project = await ProjectService.createProject({
    user,
    name,
    description,
  });
  successResponse.data = project;

  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;
  const { page = 1, limit = 5 } = req.query;
  const { data, meta } = await ProjectService.getAllProjects({
    user,
    page,
    limit,
  });
  successResponse.data = data;
  successResponse.meta = meta;

  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const updateProject = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;
  const { id } = req.params;

  await ProjectService.updateProject({ id, body: req.body });
  return res.status(StatusCodes.OK).json(successResponse);
});
