import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * User interface
 */
export interface IUser extends Document {
  name: string;
  email: string;
  gender: string;
  password: string;
  avatar?: {
    public_id?: string;
    url?: string;
  };
  role: string;
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  getJWTToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

/**
 * User Schema
 */
const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  gender: {
    type: String,
    required: [true, "Please Enter Gender"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [8, "Password should have atleast 8 chars"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

/**
 * Encrypt password before saving
 */
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});


/**
 * Compare password
 */
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Reset password token
 */
userSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  return resetToken;
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;