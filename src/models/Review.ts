import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Schema.Types.ObjectId;
  bookId: string;
  rating: number;
  reviewText: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookId: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    reviewText: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IReview>("Review", ReviewSchema);