import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

projectSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const filter = this.getQuery();
    const projectId = filter._id;

    if (projectId) {
      await mongoose.model("Chat").deleteMany({ projectId });
    }

    next();
  },
);

export default mongoose.model("Project", projectSchema);
