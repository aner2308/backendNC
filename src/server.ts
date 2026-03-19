import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import bookStatusRoutes from "./routes/bookStatusRoutes";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/books", bookStatusRoutes);

app.get("/", (req, res) => {
  res.send("NextChapter API körs");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Kopplad till MongoDB");
    app.listen(PORT, () => {
      console.log(`Server körs på port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));