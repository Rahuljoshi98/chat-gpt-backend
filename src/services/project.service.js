import { StatusCodes } from "http-status-codes";
import AppError from "../utils/errors/appError.js";
import { ProjectRepository } from "../repository/index.js";
import { getFieldsToUpdate } from "../utils/helpers/index.js";

export const createProject = async (data) => {
  try {
    const { user, name, description } = data;

    const project = await ProjectRepository.create({
      user: user._id,
      name,
      description,
    }).then((doc) => doc.toObject());

    delete project.__v;
    delete project.user;
    delete project.createdAt;
    delete project.updatedAt;

    return project;
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ["Something went wrong while creating project"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getAllProjects = async (data) => {
  try {
    const { user, page, limit } = data;
    const skip = (page - 1) * limit;

    const projects = await ProjectRepository.getAllProjects({
      user: user._id,
      skip,
      limit,
      page,
    });
    return projects;
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ["Something went wrong while getting projects"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const updateProject = async (data) => {
  try {
    const { id, body } = data;

    const allowedfieldsToUpdate = ["name", "description"];

    const fieldsToBeUpdated = getFieldsToUpdate(allowedfieldsToUpdate, body);

    const project = await ProjectRepository.findByIdAndUpdate(
      id,
      fieldsToBeUpdated,
    );
    return project;
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ["Something went wrong while updating projects"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
