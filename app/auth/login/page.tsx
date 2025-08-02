"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6"
          required
        />

        <Button type="submit" className="w-full mb-2">
          Login
        </Button>

        {/* Link ke logout dan halaman utama */}
        <div className="text-center text-sm text-gray-600 mt-4 space-y-1">
          <p>
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Daftar di sini
            </Link>
          </p>
          <p>
            Sudah login dan ingin keluar?{" "}
            <Link href="/auth/logout" className="text-red-600 hover:underline">
              Logout
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
