"use client";

import { useState } from "react";

type FormData = {
    name: string;
    email: string;
    phone: string;
    problemStatus: string;
};

export default function IntakeForm() {
    const [form, setForm] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        problemStatus: "",
    });

    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");

    const cases = [
        { title: "Ya me notificaron" },
        { title: "Creo que me van a notificar" },
        { title: "Quiero conocer mis opciones antes de que me notifiquen" },
    ];

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Clear email error when user starts typing
        if (name === "email") {
            setEmailError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate email before submitting
        if (!validateEmail(form.email)) {
            setEmailError("Please enter a valid email address (e.g., name@domain.com)");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.error || "Failed to save");
                alert("Something went wrong. Please try again.");
                setLoading(false);
                return;
            }

            window.location.href = "/gracias";
        } catch (error) {
            console.error("Network error:", error);
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-xl space-y-5">
            <h1 className="text-3xl font-semibold text-center text-black">
                Obtén asesoría completando el formulario.
            </h1>

            <input
                name="name"
                required
                placeholder="Nombre y Apellido*"
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg text-gray-700"
            />

            <input
                name="phone"
                required
                placeholder="Teléfono*"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg text-gray-700"
            />

            <div>
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="Correo*"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg text-gray-700 ${emailError ? 'border-red-500' : ''}`}
                />
                {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
            </div>

            <select
                name="problemStatus"
                required
                value={form.problemStatus}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg text-gray-700"
            >
                <option value="">¿Te notificaron?*</option>
                {cases.map((c) => (
                    <option key={c.title} value={c.title}>
                        {c.title}
                    </option>
                ))}
            </select>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-xl transition"
            >
                {loading ? "Enviando..." : "QUIERO ASESORÍA LEGAL"}
            </button>
        </form>
    );
}