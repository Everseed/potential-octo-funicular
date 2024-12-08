'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  Clock, 
  Users,
  Star,
  Play,
  Filter,
  Search 
} from "lucide-react"

const courses = [
  {
    id: "1",
    title: "Formation React Complète",
    description: "Maîtrisez React avec les hooks et les dernières fonctionnalités",
    progress: 65,
    instructor: "Sarah Martin",
    duration: "12h",
    students: 1234,
    rating: 4.8,
    image: "/api/placeholder/300/200"
  },
  // ... plus de cours
]

export default function CoursesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes cours</h1>
          <p className="text-muted-foreground">
            Continuez votre apprentissage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher un cours..."
              className="pl-10 h-10 w-full md:w-[250px] rounded-md border border-input bg-background"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Progression totale
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">68%</span>
                <span className="text-sm text-muted-foreground">12/20 cours</span>
              </div>
              <Progress value={68} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Temps total d'apprentissage
            </h3>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-xl font-bold">24h</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Certifications obtenues
            </h3>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <span className="text-xl font-bold">3</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={course.image} 
                alt={course.title}
                className="object-cover w-full h-full"
              />
              <Button 
                size="icon"
                className="absolute top-2 right-2"
                variant="secondary"
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold truncate">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <img 
                    src="/api/placeholder/40/40" 
                    alt={course.instructor}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{course.instructor}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}