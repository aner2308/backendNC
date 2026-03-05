import { Request, Response } from "express";
import Review from "../models/Review";

interface AuthRequest extends Request {
    user?: any;
}

// Skapa recension
export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { bookId, rating, reviewText } = req.body;

        //Skapar ny recensyion i databasen
        const review = await Review.create({
            user: req.user._id,
            bookId,
            rating,
            reviewText
        });

        //Status ok
        res.status(201).json(review);

        //Vid fel, skickar error
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Hämta recensioner för en bok
export const getReviewsByBook = async (req: Request, res: Response) => {
    try {
        const { bookId } = req.params;

        //Hämtar alla reviews för en vald bok
        const reviews = await Review.find({ bookId }).populate("user", "username");

        res.json(reviews);

        //Vid fel, skickar error
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Uppdatera recension
export const updateReview = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { rating, reviewText } = req.body;

        //Hämtar recension från databasen
        const review = await Review.findById(id);

        //Om recensioner inte finns
        if (!review) {
            return res.status(404).json({ message: "Ingen recension hittades." });
        }

        //Kontrollerar om användaren har skrivit recensionen
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Saknar behörighet" });
        }

        // Uppdaterar fält om nya värden finns
        review.rating = rating ?? review.rating;
        review.reviewText = reviewText ?? review.reviewText;

        await review.save();

        res.json(review);

        //Vid fel, skickar error
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Ta bort recension
export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        //Hämta recension
        const review = await Review.findById(id);

        //Om recension inte finns
        if (!review) {
            return res.status(404).json({ message: "Ingen recension hittades." });
        }

        //Kontrollerar om användaren har skrivit recensionen
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Saknar behörighet" });
        }

        //Radera recension
        await Review.findByIdAndDelete(review._id);

        res.json({ message: "Recensionen är raderad!" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};