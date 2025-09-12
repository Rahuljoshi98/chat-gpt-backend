import CrudRepository from "./crud.repository.js";
import { Chat, Interaction } from "../models/index.js";
import AppError from "../utils/errors/appError.js";
import { StatusCodes } from "http-status-codes";

class ChatRepository extends CrudRepository {
  constructor() {
    super(Chat);
  }

  async getOrCreateChat({ userId, chatId, projectId }) {
    if (chatId) {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new AppError(["Chat Not found"], StatusCodes.NOT_FOUND);
      }
      return chat;
    }
    return await Chat.create({
      userId,
      projectId: projectId || null,
      title: "New Chat",
    });
  }

  async getAllChats(data) {
    const { user, page = 1, limit = 10 } = data;
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      this.model
        .find({ userId: user })
        .sort({ createdAt: -1 })
        .select("title createdAt") // add createdAt for FE
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments({ userId: user }),
    ]);

    if (!chats) {
      throw new AppError(["Chats not found"], StatusCodes.NOT_FOUND);
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: chats,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async deleteUserChat(data) {
    await this.model.findByIdAndDelete(data);
    await Interaction.deleteMany({ chat: data });
  }
}

export default new ChatRepository();
