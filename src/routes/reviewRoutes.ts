import express from "express";
import {
  createReview,
  getReviewsByBook,
  updateReview,
  deleteReview
} from "../controllers/reviewController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Skyddade routes
router.post("/", protect, createReview);      //Skapa recension
router.get("/:bookId", getReviewsByBook);     //Hämta recensioner för specifik bok
router.put("/:id", protect, updateReview);    //Uppdatera egen recension
router.delete("/:id", protect, deleteReview); //Radera egen recension

export default router;