import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Course {
  id: string
  title: string
  progress: number
  completedLessons: number
  totalLessons: number
}

interface CourseProgressProps {
  courses: Course[]
}

export function CourseProgress({ courses }: CourseProgressProps) {
  // Calculer la progression globale
  const overallProgress = courses.reduce((acc, course) => acc + course.progress, 0) / courses.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progression Globale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} />
        </div>

        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{course.title}</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <div className="text-xs text-gray-500">
                {course.completedLessons} sur {course.totalLessons} leçons complétées
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}