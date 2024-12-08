// components/auth/social-buttons.tsx
"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import { useState } from "react";

export function SocialButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    try {
      setIsLoading(provider);
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Social login error:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("google")}
        disabled={!!isLoading}
        className="w-full"
      >
        <Mail className="mr-2 h-4 w-4" />
        Continuer avec Google
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin("github")}
        disabled={!!isLoading}
        className="w-full"
      >
        <Github className="mr-2 h-4 w-4" />
        Continuer avec GitHub
      </Button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>
    </div>
  );
}