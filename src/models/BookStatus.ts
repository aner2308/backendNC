import mongoose, { Schema, Document } from "mongoose";

export interface IBookStatus extends Document {
  user: mongoose.Schema.Types.ObjectId;
  bookId: string; // Google Books ID
  status: "want-to-read" | "reading" | "finished";
  pagesRead?: number;
  startDate?: Date;
  endDate?: Date;
  format?: "ebook" | "audiobook" | "paperback";
}

const BookStatusSchema: Schema = new Schema(
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
    status: {
      type: String,
      enum: ["want-to-read", "reading", "finished"],
      default: "want-to-read"
    },
    pagesRead: {
      type: Number
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    format: {
      type: String,
      enum: ["ebook", "audiobook", "paperback"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IBookStatus>("BookStatus", BookStatusSchema);