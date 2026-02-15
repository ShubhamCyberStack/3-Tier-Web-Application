export async function POST(request) {
    try {
        const { bookId, comment, rating, token } = await request.json();
        const API_URL = process.env.API_URL || "http://internal-internalloadbalancer-1307064942.ap-south-1.elb.amazonaws.com:3001";
        // Forward POST to backend
        const res = await fetch(`${API_URL}/api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ bookId, comment, rating })
        });
        const data = await res.json();
        if (!res.ok) return new Response(JSON.stringify(data), { status: res.status });
        return Response.json(data);
    } catch (err) {
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
