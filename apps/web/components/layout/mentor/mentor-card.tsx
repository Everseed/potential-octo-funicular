import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Clock } from "lucide-react"

interface Mentor {
  id: string
  name: string
  role: string
  specialties: string[]
  rating: number
  reviews: number
  hourlyRate: number
  availability: string
  image: string
  bio: string
}

interface MentorCardProps {
  mentor: Mentor
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* En-tête du mentor */}
        <div className="flex items-start gap-4">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{mentor.name}</h3>
            <p className="text-sm text-gray-500">{mentor.role}</p>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{mentor.rating}</span>
              <span className="text-sm text-gray-500">({mentor.reviews} avis)</span>
            </div>
          </div>
        </div>

        {/* Spécialités */}
        <div className="flex flex-wrap gap-2">
          {mentor.specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600">{mentor.bio}</p>

        {/* Informations et Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{mentor.hourlyRate}€/heure</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{mentor.availability}</span>
            </div>
          </div>
          <Button>
            Réserver
          </Button>
        </div>
      </div>
    </Card>
  )
}