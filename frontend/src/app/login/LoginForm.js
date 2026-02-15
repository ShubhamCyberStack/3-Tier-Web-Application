"use client";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async e => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            // Store JWT or session token
            if(data.token) {
                localStorage.setItem("token", data.token);
                window.location.href = "/"; // Redirect after login
            } else {
                setError("No token received.");
            }
        } catch (err) {
            setError(err.message || "Login failed.");
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto p-4 border rounded bg-white shadow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input className="w-full p-2 border rounded mt-2"
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)} required />
            <input className="w-full p-2 border rounded mt-2"
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} required />
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" type="submit">
                Login
            </button>
        </form>
    );
}
