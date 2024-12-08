'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Search, Filter, Star, Clock, Video } from "lucide-react"

const mentors = [
  {
    id: "1",
    name: "Sarah Martin",
    role: "Senior Developer",
    specialties: ["React", "Node.js", "Cloud"],
    rating: 4.9,
    reviews: 128,
    hourlyRate: 85,
    availability: "Cette semaine",
    image: "/api/placeholder/40/40",
    bio: "10+ ans d'expérience en développement web et architecture cloud.",
    nextAvailable: "Demain, 14:00"
  },
  {
    id: "2",
    name: "Thomas Chen",
    role: "Tech Lead",
    specialties: ["Python", "Machine Learning", "DevOps"],
    rating: 4.8,
    reviews: 93,
    hourlyRate: 95,
    availability: "Cette semaine",
    image: "/api/placeholder/40/40",
    bio: "Expert en ML et architecture scalable. Google Developer Expert.",
    nextAvailable: "Jeudi, 10:00"
  }
  // ... plus de mentors
]

export default function MentorsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mentors</h1>
          <p className="text-muted-foreground">
            Trouvez le mentor idéal pour votre progression
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher un mentor..."
              className="pl-10 h-10 w-full md:w-[300px] rounded-md border border-input bg-background"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['React', 'Node.js', 'Python', 'Cloud', 'DevOps'].map((tag) => (
          <Button key={tag} variant="outline" size="sm">
            {tag}
          </Button>
        ))}
      </div>

      {/* Mentors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="p-6">
            {/* Mentor Header */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{mentor.name}</h3>
                <p className="text-sm text-muted-foreground">{mentor.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{mentor.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({mentor.reviews} avis)
                  </span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {mentor.bio}
            </p>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{mentor.hourlyRate}€/heure</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{mentor.nextAvailable}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="flex-1">
                Réserver une session
              </Button>
              <Button variant="outline" size="icon">
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}