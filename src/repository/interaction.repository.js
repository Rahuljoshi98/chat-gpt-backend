import CrudRepository from "./crud.repository.js";
import { Interaction } from "../models/index.js";
import AppError from "../utils/errors/appError.js";
import { StatusCodes } from "http-status-codes";

class InteractionRepository extends CrudRepository {
  constructor() {
    super(Interaction);
  }

  async getChatHistory(chatId) {
    const interactions = await this.model
      .find({ chat: chatId })
      .sort({ createdAt: 1 })
      .select("input response createdAt");
    if (!interactions.length) {
      throw new AppError(
        ["No chat history found for this chat"],
        StatusCodes.NOT_FOUND,
      );
    }

    const history = [];

    interactions.forEach((doc) => {
      if (doc.input?.text || doc.input?.attachments?.length) {
        history.push({
          role: "user",
          content: doc.input?.text || "",
          inputType: doc.input?.inputType,
          attachments: doc.input?.attachments || [],
          language: doc.input?.language,
          createdAt: doc.createdAt,
        });
      }

      if (doc.response?.text || doc.response?.attachments?.length) {
        history.push({
          role: "assistant",
          content: doc.response?.text || "",
          attachments: doc.response?.attachments || [],
          model: doc.response?.model,
          provider: doc.response?.provider,
          inputType: doc.response?.inputType,
          createdAt: doc.createdAt,
        });
      }
    });
    return history;
  }
}

export default new InteractionRepository();
