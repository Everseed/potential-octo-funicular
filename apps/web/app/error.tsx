'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-semibold">Quelque chose s'est mal passé !</h1>
          <p className="text-muted-foreground">
            {error.message || "Une erreur inattendue s'est produite."}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => reset()}>Réessayer</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}