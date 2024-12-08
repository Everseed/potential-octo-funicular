'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp,
  Calendar,
  ArrowRight,
  Star 
} from "lucide-react"

const stats = [
  {
    label: "Cours en cours",
    value: "5",
    icon: BookOpen,
    trend: "+2",
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    label: "Sessions prévues",
    value: "3",
    icon: Calendar,
    trend: "+1",
    color: "text-green-600",
    bg: "bg-green-100"
  },
  {
    label: "Heures d'apprentissage",
    value: "24",
    icon: Clock,
    trend: "+3",
    color: "text-purple-600",
    bg: "bg-purple-100"
  },
  {
    label: "Progression globale",
    value: "68%",
    icon: TrendingUp,
    trend: "+5%",
    color: "text-yellow-600",
    bg: "bg-yellow-100"
  }
]

const recentActivities = [
  {
    id: "1",
    title: "Session JavaScript Avancé",
    type: "session",
    date: "Aujourd'hui, 14:00",
    mentor: "Sarah Martin",
    status: "scheduled"
  },
  {
    id: "2",
    title: "React Hooks - Module 3",
    type: "course",
    date: "Hier",
    progress: 75,
    status: "in_progress"
  }
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue ! Voici un aperçu de votre progression
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.trend && (
                      <span className="text-sm font-medium text-green-600">
                        {stat.trend}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity and Progress */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Activité récente</h2>
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg border">
                <div className={`rounded-lg p-2 ${
                  activity.type === 'session' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'session' ? (
                    <Users className="h-4 w-4 text-blue-600" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
                {activity.mentor && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{activity.mentor}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Learning Progress */}
        <Card className="lg:col-span-3 p-6">
          <h2 className="text-lg font-semibold mb-6">Progression</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vue d'ensemble</span>
                <span className="text-sm text-muted-foreground">68%</span>
              </div>
              <Progress value={68} />
            </div>
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-4">Cours populaires</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">React Masterclass</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Node.js Avancé</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}