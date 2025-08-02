// app/not-found.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <Image
        src="/404.svg" // kamu bisa pakai gambar lain di public/
        alt="Not Found"
        width={300}
        height={300}
        className="mb-6"
      />

      <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops! Halaman Tidak Ditemukan</h1>
      <p className="text-gray-600 mb-6">
        Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
      </p>

      <Button asChild>
        <Link href="/dashboard">Kembali ke Dashboard</Link>
      </Button>
    </div>
  );
}
