import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: "",
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: Date,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// hooks
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// predefined methods attached to schema
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(this.password, password);
};

// generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SCECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
// generate referesh token
userSchema.methods.generateRefereshToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SCECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
// generate temprory toke
userSchema.methods.generateTemproryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 min
  return { unHashedToken, hashedToken, tokenExpiry };
};
export const User = mongoose.model("User", userSchema);
