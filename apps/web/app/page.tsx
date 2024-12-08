'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Code, 
  Users, 
  GraduationCap, 
  Brain,
  ArrowRight,
  CheckCircle,
  Star 
} from "lucide-react"

const features = [
  {
    title: "Expertise Technique",
    description: "Préparez vos entretiens techniques avec des experts de l'industrie.",
    icon: Code,
    color: "blue"
  },
  {
    title: "Mentorat Personnalisé",
    description: "Bénéficiez d'un accompagnement sur mesure avec nos mentors expérimentés.",
    icon: Users,
    color: "green"
  },
  {
    title: "Certifications",
    description: "Préparez-vous aux certifications professionnelles les plus demandées.",
    icon: GraduationCap,
    color: "purple"
  },
  {
    title: "IA & Apprentissage",
    description: "Profitez d'une expérience d'apprentissage optimisée par l'IA.",
    icon: Brain,
    color: "orange"
  }
]

const stats = [
  { value: "95%", label: "Taux de réussite" },
  { value: "2000+", label: "Étudiants formés" },
  { value: "150+", label: "Experts & Mentors" },
  { value: "4.9/5", label: "Note moyenne" },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">PrepAI</h1>
            </div>
            <nav className="hidden md:flex md:items-center md:space-x-6">
              <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Tarifs
              </a>
              <Button variant="ghost" onClick={() => window.location.href = '/signin'}>
                Connexion
              </Button>
              <Button onClick={() => window.location.href = '/signup'}>
                Commencer gratuitement
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Préparez-vous aux</span>
              <span className="block text-blue-600">Défis Techniques</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
              Une plateforme qui combine expertise humaine et intelligence artificielle 
              pour vous aider à atteindre vos objectifs professionnels.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" onClick={() => window.location.href = '/sign-up'}>
                Commencer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Voir une démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Fonctionnalités</h2>
            <p className="mt-4 text-lg text-gray-600">
              Tout ce dont vous avez besoin pour réussir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
                <div className={`h-12 w-12 rounded-lg bg-${feature.color}-100 flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} PrepAI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}