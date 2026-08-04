import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Metal holdings for a single user.
 *
 * One document per (user, assetType) pair — this keeps the schema simple
 * and makes it trivial to add new metals later (e.g. palladium) without a
 * migration. `amount` is stored in grams to match the units used across
 * the dashboard UI (see web/lib/store.ts: goldGrams / silverGrams /
 * platinumGrams).
 */
export type AssetType = "gold" | "silver" | "platinum";

export interface IHolding extends Document {
  user: mongoose.Types.ObjectId;
  assetType: AssetType;
  amount: number; // grams
  updatedAt: Date;
}

const holdingSchema: Schema<IHolding> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assetType: {
      type: String,
      enum: ["gold", "silver", "platinum"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

// A user should only have one holding document per asset type.
holdingSchema.index({ user: 1, assetType: 1 }, { unique: true });

const Holding: Model<IHolding> =
  mongoose.models.Holding || mongoose.model<IHolding>("Holding", holdingSchema);

export default Holding;
