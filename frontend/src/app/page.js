// Server Component - NO "use client" directive!
import Link from "next/link";

// Server-side function to fetch books
async function fetchBooks() {
  try {
    const API_URL = process.env.API_URL || 'http://internal-internalloadbalancer-1307064942.ap-south-1.elb.amazonaws.com:3001';
    
    console.log(`[Server] Fetching books from: ${API_URL}/api/books`);
    
    const res = await fetch(`${API_URL}/api/books`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`[Server] Failed to fetch books: ${res.status} ${res.statusText}`);
      return [];
    }

    const books = await res.json();
    console.log(`[Server] Successfully fetched ${books.length} books`);
    return books;
    
  } catch (error) {
    console.error('[Server] Error fetching books:', error);
    return [];
  }
}

// Server Component (async!)
export default async function Home() {
  const books = await fetchBooks();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Book Review App</h1>
      
      {books.length === 0 ? (
        <p className="text-center text-gray-600">No books available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <Link key={book.id} href={`/book/${book.id}`} passHref>
              <div className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition duration-200">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-600">by {book.author}</p>
                <p className="text-sm mt-2">⭐ {book.rating}/5</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
