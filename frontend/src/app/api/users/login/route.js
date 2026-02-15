export async function POST(request) {
    try {
        const { email, password } = await request.json();
        const API_URL = process.env.API_URL || "http://internal-internalloadbalancer-1307064942.ap-south-1.elb.amazonaws.com:3001";
        const res = await fetch(`${API_URL}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) return new Response(JSON.stringify(data), { status: res.status });
        return Response.json(data);
    } catch (err) {
        return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
    }
}
