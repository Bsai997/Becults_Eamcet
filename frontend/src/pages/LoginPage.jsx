import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { loginSchema } from "../types/schemas";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const parsed = loginSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email });
      login(response.data.user);
      navigate(response.data.user.role === "admin" ? "/admin" : "/student");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email"
          className="w-full rounded border p-2"
        />
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}
