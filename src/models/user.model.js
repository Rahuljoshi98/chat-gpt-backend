import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    clerkId: {
      type: String,
      required: [true, "Clerk ID is required"],
      unique: true,
    },
    profileColor: {
      type: String,
      default: "#0078D7",
    },
    // password: {
    //   type: String,
    //   required: true,
    //   select: false,
    //   trim: true,
    // },
  },
  { timestamps: true },
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

// userSchema.methods.validatePassword = async function (password) {
//   const isPasswordValid = await bcrypt.compare(password, this.password);
//   return isPasswordValid;
// };

// userSchema.methods.generateAccessToken = async function () {
//   return await jwt.sign(
//     {
//       _id: this?._id,
//     },
//     process.env.JWT_SECRET_KEY,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
//     },
//   );
// };

// userSchema.methods.generateRefreshToken = async function () {
//   return await jwt.sign(
//     {
//       _id: this?._id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
//     },
//   );
// };

const User = mongoose.model("User", userSchema);

export default User;
