import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

//Skyddar routes genom att kräva ett giltigt JWT token
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  //Variabl för att lagra token
  let token;

  try {

    //Kontrollerar att Authorization-header finns
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

      //Tar ut token från headern (tar bort Bearer)
      token = req.headers.authorization.split(" ")[1];

      //Verifiera token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      //Hämta användaren från databasen baserat på id i token, och tar bort password.
      const user = await User.findById(decoded.id).select("-password");

      //Om användaren inte finns i databasen
      if (!user) {
        return res.status(401).json({ message: "Användaren hittades inte." });
      }

      //Lägger användaren i req.user
      req.user = user;

      //Fortsätt till nästa route som autentiserad
      next();

      //Felmeddelande om inget token finns
    } else {
      return res.status(401).json({ message: "Ej authoriserad, inget token." });
    }

    //Om token är ogiltigt
  } catch (error) {
    return res.status(401).json({ message: "Token misslyckades." });
  }
};