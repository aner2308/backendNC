import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Registrera användare funktionalitet
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    //kontrollerar om email redan är upptagen av annan användare
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hashar lösenord innan det sparas i databasen
    const hashedPassword = await bcrypt.hash(password, 10);

    //Skapar ny användare
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    //Returnera användare
    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Logga in användare funktionalitet
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //Hämta användare baserad på email
    const user = await User.findOne({ email });

    //Om användaren inte finns
    if (!user) {
      return res.status(400).json({ message: "Felaktigt värde" });
    }

    //Jämför lösenord mot databasen
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Felaktigt värde" });
    }

    //Skapa JWT token för autentisering
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    //Returnera token och användarinformation
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};