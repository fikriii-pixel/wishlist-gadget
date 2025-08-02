"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut()}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
    >
      Logout
    </Button>
  );
}
