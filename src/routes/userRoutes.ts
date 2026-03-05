import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

//Testroute för en användares privata sida
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: (req as any).user
  });
});

export default router;