import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/layout/course-card"
import { Search, Filter } from "lucide-react"

// Données d'exemple
const courses = [
  {
    id: "1",
    title: "React Avancé",
    description: "Maîtrisez les concepts avancés de React avec des exemples pratiques",
    instructor: "Sarah Miller",
    level: "Avancé",
    duration: "8 heures",
    rating: 4.8,
    students: 1234,
    price: 99.99,
    image: "/api/placeholder/300/200",
    tags: ["React", "JavaScript", "Web"]
  },
  // ... autres cours
]

export default function BrowsePage() {
  return (
    <div className="space-y-6">
      {/* Header avec recherche et filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="Rechercher un cours..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {courses.length} résultats
          </span>
        </div>
      </div>

      {/* Grille de cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}