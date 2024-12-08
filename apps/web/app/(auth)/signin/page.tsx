// app/(auth)/signin/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/signin-form";
import { DevLogin } from "@/components/auth/dev-login";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Connectez-vous à votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />
          {process.env.NODE_ENV === "development" && <DevLogin />}
        </CardContent>
      </Card>
    </div>
  );
}