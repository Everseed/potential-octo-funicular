'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { toast } from '@/components/ui/use-toast';
import { mockUsers } from '../mock-users';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Erreur de connexion',
          description: result.error,
        });
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsMock = async (user: typeof mockUsers[0]) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Erreur de connexion',
          description: result.error,
        });
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="relative my-4 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Connexion rapide (Dev)
              </span>
            </div>
          </div>

          <div className="grid w-full gap-2">
            {mockUsers.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                onClick={() => loginAsMock(user)}
                disabled={isLoading}
                className="justify-start"
              >
                <span className="flex-1 text-left">{user.name}</span>
                <span className="text-xs text-muted-foreground">({user.role})</span>
              </Button>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}