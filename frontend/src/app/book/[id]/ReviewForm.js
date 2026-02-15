"use client";
import { useState } from "react";

export default function ReviewForm({ bookId, onReviewSubmitted }) {
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(5);
    const [error, setError] = useState(null);

    const handleReviewSubmit = async e => {
        e.preventDefault();
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to post a review.");
            return;
        }
        try {
            const res = await fetch("/api/reviews/submit", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ bookId, comment: newReview, rating, token })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit review");
            setNewReview("");
            setRating(5);
            setError(null);
            onReviewSubmitted && onReviewSubmitted();
        } catch (err) {
            setError(err.message || "Failed to submit review.");
        }
    };

    return (
        <form onSubmit={handleReviewSubmit} className="mt-4 p-4 border rounded bg-white shadow">
            <h3 className="text-xl">Add a Review</h3>
            {error && <p className="text-red-500">{error}</p>}
            <textarea className="w-full p-2 border rounded mt-2"
                      placeholder="Write your review..." value={newReview}
                      onChange={e => setNewReview(e.target.value)} required />
            <select className="w-full p-2 border rounded mt-2"
                    value={rating} onChange={e => setRating(Number(e.target.value))}>
                {[1,2,3,4,5].map(num => <option key={num} value={num}>{num}</option>)}
            </select>
            <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" type="submit">
                Submit Review
            </button>
        </form>
    );
}
