'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DevLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginAsAdmin = async () => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: "admin1@test.com",
        password: "admin123",
        redirect: false,
      });

      if (res?.error) {
        console.error("Erreur de connexion:", res.error);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={loginAsAdmin}
      className="w-full"
      disabled={loading}
    >
      Connexion rapide (Admin)
    </Button>
  );
}
