import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// app/(auth)//
export default function VerifyRequestPage() {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Vérifiez votre email</CardTitle>
            <CardDescription>
              Un lien de vérification a été envoyé à votre adresse email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }