// app/(auth)/error.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
            <CardTitle>Erreur d'authentification</CardTitle>
          </div>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="outline" onClick={() => router.push('/auth/signin')}>
            Retour à la connexion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}