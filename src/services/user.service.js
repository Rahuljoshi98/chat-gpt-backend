import { StatusCodes } from "http-status-codes";
import AppError from "../utils/errors/appError.js";
import { clerkClient } from "@clerk/express";
import { generateRandomColorLight } from "../utils/helpers/index.js";
import { UserRepository } from "../repository/index.js";
import { handleClerkError } from "../utils/errors/clerkError.js";

export const createUser = async (data) => {
  try {
    const {
      id: clerkId,
      first_name: firstName,
      last_name: lastName,
      email_addresses,
    } = data.data;

    const email = email_addresses?.[0]?.email_address;

    const payload = {
      firstName,
      lastName,
      clerkId,
      profileColor: generateRandomColorLight(),
      email,
    };

    const user = await UserRepository.create(payload);
    if (user) {
      return user;
    }
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;

    if (error.clerkError) {
      handleClerkError(error);
    }

    throw new AppError(
      ["Something went wrong while creating user"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
