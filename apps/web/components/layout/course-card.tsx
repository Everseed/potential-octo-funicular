import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Clock, Users } from "lucide-react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    instructor: string
    level: string
    duration: string
    rating: number
    students: number
    price: number
    image: string
    tags: string[]
  }
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img 
          src={course.image} 
          alt={course.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-white rounded text-sm font-medium">
          {course.level}
        </div>
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-500">{course.instructor}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="font-bold">{course.price}€</span>
        <Button>
          En savoir plus
        </Button>
      </CardFooter>
    </Card>
  )
}