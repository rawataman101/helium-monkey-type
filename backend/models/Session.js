import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: String,
  wpm: Number,
  accuracy: Number,
  totalErrors: Number,
  errorWords: [String],
  typingDurations: [Number],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Session", SessionSchema);
