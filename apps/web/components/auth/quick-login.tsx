// app/(auth)/signin/page.tsx
'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function QuickLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
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

  // Pour le développement - connexion rapide
  const loginAsAdmin = async () => {
    setLoading(true);
    try {
      await signIn("credentials", {
        email: "admin1@test.com",
        password: "admin123",
        redirect: false,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Mot de passe"
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Chargement..." : "Se connecter"}
            </Button>
          </form>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={loginAsAdmin}
                className="w-full"
                disabled={loading}
              >
                Connexion rapide (Admin)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}