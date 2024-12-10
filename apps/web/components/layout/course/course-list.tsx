import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play, Clock } from "lucide-react"

interface Course {
  id: string
  title: string
  progress: number
  nextLesson: string
  totalLessons: number
  completedLessons: number
  lastAccessed: Date
  duration: string
  category: string
}

interface CourseListProps {
  courses: Course[]
}

export function CourseList({ courses }: CourseListProps) {
  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card key={course.id} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.category}</p>
              </div>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Continuer
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} />
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration}
              </div>
              <span>{course.completedLessons}/{course.totalLessons} leçons</span>
            </div>

            <div className="text-sm">
              <p className="text-gray-600">Prochaine leçon :</p>
              <p className="font-medium">{course.nextLesson}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}