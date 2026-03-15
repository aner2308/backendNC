import { Request, Response } from "express";
import BookStatus from "../models/BookStatus";
import Review from "../models/Review";

interface AuthRequest extends Request {
    user?: any;
}

// Lägg till / uppdatera status
export const upsertBookStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { bookId, status, pagesRead, startDate, endDate, format } = req.body;

        //Hämtar in bok
        let bookStatus = await BookStatus.findOne({
            user: req.user._id,
            bookId
        });

        if (bookStatus) {
            // Uppdatera befintlig
            bookStatus.status = status ?? bookStatus.status;
            bookStatus.pagesRead = pagesRead ?? bookStatus.pagesRead;
            bookStatus.startDate = startDate ?? bookStatus.startDate;
            bookStatus.endDate = endDate ?? bookStatus.endDate;
            bookStatus.format = format ?? bookStatus.format;

            await bookStatus.save();

            return res.json({
                message: "Bok uppdaterad i biblioteket",
                updated: true,
                bookStatus,
            });
        } else {
            // Skapa ny
            bookStatus = await BookStatus.create({
                user: req.user._id,
                bookId,
                status,
                pagesRead,
                startDate,
                endDate,
                format
            });
        }

        res.status(201).json({
            message: "Bok tillagd i biblioteket",
            updated: false,
            bookStatus,
        });

        //Felmeddelande
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Hämta alla böcker för användaren
export const getUserBooks = async (req: AuthRequest, res: Response) => {
    try {

        //Hämta in böcker
        const books = await BookStatus.find({ user: req.user._id });
        res.json(books);

        //Felmeddelande
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Ta bort status
export const deleteBookStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        //Hämtar in bok
        const status = await BookStatus.findById(id);

        //Om status inte finns, felmeddelande
        if (!status) return res.status(404).json({ message: "Status hittades ej" });

        //Om status inte matchar
        if (status.user.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "Ingen behörighet" });

        //Radera status
        await BookStatus.findByIdAndDelete(id);

        res.json({ message: "Bokstatus raderad!" });

        //Felmeddelande
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getReadingStats = async (req: AuthRequest, res: Response) => {
    try {

        // Hämta alla bokstatusar för den inloggade användaren
        const books = await BookStatus.find({ user: req.user._id });

        // Räkna antal böcker i varje status
        const wantToRead = books.filter(b => b.status === "want-to-read").length;
        const reading = books.filter(b => b.status === "reading").length;
        const finished = books.filter(b => b.status === "finished").length;

        // Summera antal lästa sidor
        const totalPagesRead = books.filter(book => book.status === "finished").reduce((sum, book) => {
            return sum + (book.pagesRead || 0);
        }, 0);

        //Genomsnittsbetyg givet
        const userReviews = await Review.find({ user: req.user._id });
        const averageRatingGiven = userReviews.length > 0 ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length : 0;

        // Antal böcker lästa under året
        const currentYear = new Date().getFullYear();
        const booksFinishedThisYear = books.filter(b => b.status === "finished" && b.endDate && b.endDate.getFullYear() === currentYear).length;

        // Skicka tillbaka statistik
        res.json({
            wantToRead,
            reading,
            finished,
            totalPagesRead,
            averageRatingGiven: Number(averageRatingGiven.toFixed(1)), // rundar till 1 decimal
            booksFinishedThisYear
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};