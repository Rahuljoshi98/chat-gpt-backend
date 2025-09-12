import { StatusCodes } from "http-status-codes";
import AppError from "../utils/errors/appError.js";
import { ChatRepository, InteractionRepository } from "../repository/index.js";
import * as AiService from "./ai.service.js";

export const addInteraction = async (data) => {
  try {
    const { user, chatId, projectId, userText, attachments, model } = data;
    const chat = await ChatRepository.getOrCreateChat({
      userId: user._id,
      chatId,
      projectId,
    });

    const payload = {
      chat: chatId || chat._id,
      user: user._id,
      input: {
        text: userText,
        inputType: attachments?.length ? "text+file" : "text",
        attachments,
      },
      status: "processing",
    };

    let interaction = await InteractionRepository.create(payload);

    const chatHistory = await InteractionRepository.getChatHistory(chat);

    const response = await AiService.getAIResponse(userText, chatHistory);
    interaction.response.text = response.json.response_text;
    interaction.response.model = response.model || "gpt-4o-mini";
    await interaction.save();
    const resData = {
      role: "assistant",
      content: {
        type: response.json.response_type,
        data: response.json.response_text,
      },
      model: response.model || "gpt-4o-mini",
      timestamp: new Date(),
    };

    return resData;
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ["Something went wrong while adding message"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getChatHistory = async (data) => {
  try {
    const chatHistory = await InteractionRepository.getChatHistory(data);
    return chatHistory;
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ["Something went wrong while getting chat history"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getAllChats = async (data) => {
  try {
    const { user, page = 1, limit = 10 } = data;
    console.log("user--->", user);
    const skip = (page - 1) * limit;

    const chats = ChatRepository.getAllChats({ user, skip, limit });

    return chats;
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ["Something went wrong while getting chats"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const deleteUserChat = async (data) => {
  try {
    // use trasaction later
    const { user, id } = data;

    await ChatRepository.deleteOne(id);
    return;
  } catch (error) {
    console.log("error -->", error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ["Something went wrong while deleting chat"],
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
