import Link from "next/link";
import ReviewForm from "./ReviewForm"; // <--- Import at the top

async function fetchBookDetails(id) {
    const API_URL = process.env.API_URL || "http://internal-internalloadbalancer-1307064942.ap-south-1.elb.amazonaws.com:3001";
    const res = await fetch(`${API_URL}/api/books/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch book details");
    return res.json();
}

async function fetchReviews(id) {
    const API_URL = process.env.API_URL || "http://internal-internalloadbalancer-1307064942.ap-south-1.elb.amazonaws.com:3001";
    const res = await fetch(`${API_URL}/api/reviews/${id}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
}

export default async function BookDetails({ params }) {
    const id = params.id;
    let book;
    let reviews;

    try {
        book = await fetchBookDetails(id);
    } catch (e) {
        return <p className="text-center text-red-500">Error loading book details.</p>;
    }

    try {
        reviews = await fetchReviews(id);
    } catch {
        reviews = [];
    }

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">{book.title}</h1>
            <p className="text-gray-600">by {book.author}</p>
            <p className="text-sm mt-2">⭐ {book.rating}/5</p>
            <h2 className="text-2xl mt-6">Reviews</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                <ul className="mt-2">
                    {reviews.map((review, idx) => (
                        <li key={idx} className="border p-2 my-2 rounded">
                            <p className="font-bold">{review.username}</p>
                            <p>{review.comment}</p>
                            <p className="text-sm">⭐{review.rating}/5</p>
                        </li>
                    ))}
                </ul>
            )}

            {/* --- Here is your review form --- */}
            <ReviewForm
                bookId={id}
                onReviewSubmitted={() => {
                    if (typeof window !== "undefined") window.location.reload();
                }}
            />
        </div>
    );
}
