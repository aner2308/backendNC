import express from "express";
import {
  upsertBookStatus,
  getUserBooks,
  deleteBookStatus,
  getReadingStats
} from "../controllers/bookStatusController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

//Routes för bokstatus
router.get("/stats", protect, getReadingStats);   // Hämta statistik om ens läsning
router.get("/user", protect, getUserBooks);       // Hämta alla
router.post("/", protect, upsertBookStatus);      // Lägg till / uppdatera
router.delete("/:id", protect, deleteBookStatus); // Ta bort

export default router;