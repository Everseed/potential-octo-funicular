// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExpertsSection } from "@/components/layout/experts-section";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Rejoignez les experts qui partagent leur expertise
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            PrepAI connecte les experts aux étudiants pour des sessions de coaching personnalisées. Tutorat, mentorat, entretiens d'entraînement - commencez dès aujourd'hui.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth/signup">
                Je suis un expert
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">
                Je suis un étudiant
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Sessions 1:1</h3>
              <p className="text-muted-foreground">
                Réservez des sessions individuelles avec des experts dans votre domaine
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Mock Interviews</h3>
              <p className="text-muted-foreground">
                Préparez-vous aux entretiens avec des exercices pratiques
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Code Reviews</h3>
              <p className="text-muted-foreground">
                Obtenez des retours détaillés sur vos projets de code
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Rejoignez notre communauté d'experts et d'apprenants dès aujourd'hui
          </p>
          <Button 
            asChild 
            size="lg" 
            variant="secondary"
          >
            <Link href="/auth/signup">
              Créer un compte gratuitement
            </Link>
          </Button>
        </div>
      </section>
    
        {/* Expert Section */}
        {/* <ExpertsSection /> */}

      {/* Trust Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <h3 className="text-center text-xl font-semibold mb-12">
            Ils nous font confiance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Placeholders pour les logos des entreprises */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i}
                className="h-12 bg-gray-100 rounded flex items-center justify-center"
              >
                Logo {i + 1}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}