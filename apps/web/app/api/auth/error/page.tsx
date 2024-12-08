import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams?.error || "Une erreur s'est produite";
  
  const errorMessages: Record<string, string> = {
    Signin: "Tentative de connexion échouée.",
    OAuthSignin: "Tentative de connexion avec le provider échouée.",
    OAuthCallback: "Erreur lors de la connexion avec le provider.",
    OAuthCreateAccount: "Impossible de créer un compte avec le provider.",
    EmailCreateAccount: "Impossible de créer un compte avec cet email.",
    Callback: "Erreur lors de la connexion.",
    OAuthAccountNotLinked: "Cet email est déjà associé à un autre compte.",
    EmailSignin: "Vérifiez votre email pour le lien de connexion.",
    CredentialsSignin: "Email ou mot de passe incorrect.",
    SessionRequired: "Veuillez vous connecter pour accéder à cette page.",
    default: "Une erreur inattendue s'est produite.",
  };

  const errorMessage = errorMessages[error] || errorMessages.default;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
            <CardTitle>Erreur d'authentification</CardTitle>
          </div>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/signin">Retour à la connexion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}