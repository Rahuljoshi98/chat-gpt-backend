import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "../utils/common/index.js";
import { asyncHandler } from "../utils/helpers/index.js";
import { ChatService } from "../services/index.js";

export const addInteraction = asyncHandler(async (req, res) => {
  const { text, attachments, chatId, projectId, model } = req.body;
  const user = req.user;

  const successResponse = SuccessResponse();
  const interaction = await ChatService.addInteraction({
    user,
    chatId,
    projectId,
    userText: text,
    attachments,
    model,
  });
  successResponse.data = interaction;
  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const getChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const successResponse = SuccessResponse();

  const chatHistory = await ChatService.getChatHistory(id);
  successResponse.data = chatHistory;

  return res.status(StatusCodes.OK).json(successResponse);
});

export const getAllChats = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;

  const chats = await ChatService.getAllChats({ user: user._id });
  successResponse.data = chats.data;
  successResponse.meta = chats.meta;

  return res.status(StatusCodes.OK).json(successResponse);
});

export const updateChat = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;
  const { id } = req.params;

  const response = await ChatService.updateChat({
    user: user._id,
    body: req.body,
    id,
  });
  successResponse.data = response;
  return res.status(StatusCodes.OK).json(successResponse);
});

export const deleteUserChat = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;
  const { id } = req.params;

  await ChatService.deleteUserChat({ user: user._id, id });

  return res.status(StatusCodes.OK).json(successResponse);
});
