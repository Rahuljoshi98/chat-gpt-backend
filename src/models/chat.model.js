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

ChatSchema.index({ userId: 1, createdAt: -1 });

export default model("Chat", ChatSchema);
