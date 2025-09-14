import mongoose from "mongoose";
const { Schema, model } = mongoose;

const interactionSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    input: {
      text: {
        type: String,
        trim: true,
        maxlength: 20000,
        default: "",
      },

      inputType: {
        type: String,
        enum: ["text", "file", "text+file"],
        required: true,
        default: "text",
      },

      attachments: [
        {
          type: Schema.Types.ObjectId,
          ref: "Attachment",
        },
      ],

      language: {
        type: String,
        trim: true,
      },

      promptMetadata: {
        type: Schema.Types.Mixed,
      },
    },

    response: {
      text: {
        type: String,
        trim: true,
        default: "",
      },
      inputType: {
        type: String,
        enum: ["text", "file", "text+file"],
        required: true,
        default: "text",
      },

      attachments: [
        {
          type: Schema.Types.ObjectId,
          ref: "Attachment",
        },
      ],

      model: {
        type: String,
        trim: true,
      },

      //ai provider
      provider: {
        type: String,
        trim: true,
      },

      // generation options used (temperature, max_tokens etc)
      generationOptions: {
        type: Schema.Types.Mixed,
      },

      // token accounting
      tokens: {
        promptTokens: { type: Number, default: 0 },
        completionTokens: { type: Number, default: 0 },
        totalTokens: { type: Number, default: 0 },
      },

      // streaming support: status and optionally store chunks while streaming
      stream: {
        status: {
          type: String,
          enum: ["not_streamed", "streaming", "completed", "failed"],
          default: "not_streamed",
        },

        // If you want to persist partial chunks (helpful for resuming or debugging)
        // Each chunk should be small text pieces appended in order
        chunks: [
          {
            index: Number,
            content: String,
            createdAt: { type: Date, default: Date.now },
          },
        ],
      },

      error: {
        code: String,
        message: String,
        details: Schema.Types.Mixed,
      },

      providerMeta: {
        type: Schema.Types.Mixed,
      },
    },

    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
      index: true,
    },

    // moderation results (if you run content-safety)
    moderation: {
      flagged: { type: Boolean, default: false },
      categories: { type: Schema.Types.Mixed }, // e.g. { sexual: false, hate: false }
      details: { type: Schema.Types.Mixed },
    },

    isEdited: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },

    editHistory: [
      {
        field: { type: String }, // "input.text" / "response.text" etc
        previousValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
        editedBy: { type: Schema.Types.ObjectId, ref: "User" },
        editedAt: { type: Date, default: Date.now },
      },
    ],

    metadata: {
      type: Schema.Types.Mixed,
    },

    tags: [{ type: String }],
  },
  { timestamps: true },
);

interactionSchema.index({ chat: 1, createdAt: 1 });
interactionSchema.index({ user: 1, createdAt: -1 });
interactionSchema.index({ status: 1, createdAt: 1 });

export default model("Interaction", interactionSchema);
