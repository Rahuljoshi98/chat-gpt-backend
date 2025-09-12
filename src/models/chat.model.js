import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ChatSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

ChatSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const filter = this.getQuery();
    const chatId = filter._id;
    if (chatId) {
      await mongoose.model("Interaction").deleteMany({ chat: chatId });
    }
    next();
  },
);

ChatSchema.pre(
  "deleteMany",
  { document: false, query: true },
  async function (next) {
    const filter = this.getQuery();
    const chats = await mongoose.model("Chat").find(filter).select("_id");

    if (chats.length) {
      const chatIds = chats.map((c) => c._id);
      await mongoose
        .model("Interaction")
        .deleteMany({ chat: { $in: chatIds } });
    }
    next();
  },
);

ChatSchema.index({ userId: 1, createdAt: -1 });

export default model("Chat", ChatSchema);
