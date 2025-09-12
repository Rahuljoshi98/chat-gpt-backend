import mongoose from "mongoose";
const { Schema, model } = mongoose;

/**
 * Attachment model: stores metadata for uploaded files/images.
 * Actual file is stored on Cloudinary / S3 / Uploadcare, only metadata + URL lives here.
 */
const attachmentSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    filename: {
      type: String,
      trim: true,
    },

    mimeType: {
      type: String,
      trim: true,
    },

    size: {
      type: Number, // in bytes
      default: 0,
    },

    provider: {
      type: String,
      enum: ["cloudinary", "uploadcare", "s3", "gcs", "local", "other"],
      default: "cloudinary",
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Optional fields
    width: Number, // for images
    height: Number, // for images
    pages: Number, // for docs (PDF, Word)

    thumbnailUrl: {
      type: String,
      trim: true,
    },

    scanStatus: {
      type: String,
      enum: ["pending", "clean", "flagged", "error"],
      default: "pending",
    },

    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

// Index to quickly find attachments per user
attachmentSchema.index({ uploadedBy: 1, createdAt: -1 });

export default model("Attachment", attachmentSchema);
