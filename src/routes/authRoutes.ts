import express from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

//Routes för autentisering
router.post("/register", registerUser); //Lägg till användare
router.post("/login", loginUser);       //Logga in användare

export default router;