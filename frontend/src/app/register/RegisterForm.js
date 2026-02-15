"use client";
import { useState } from "react";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async e => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");
            setSuccess("Registration successful! Please log in.");
            setUsername(""); setEmail(""); setPassword("");
        } catch (err) {
            setError(err.message || "Registration failed.");
        }
    };

    return (
        <form onSubmit={handleRegister} className="max-w-md mx-auto p-4 border rounded bg-white shadow">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            <input className="w-full p-2 border rounded mt-2"
                type="text" placeholder="Username" value={username}
                onChange={e => setUsername(e.target.value)} required />
            <input className="w-full p-2 border rounded mt-2"
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)} required />
            <input className="w-full p-2 border rounded mt-2"
                type="password" placeholder="Password" value={password}
                onChange={e => setPassword(e.target.value)} required />
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" type="submit">
                Register
            </button>
        </form>
    );
}

