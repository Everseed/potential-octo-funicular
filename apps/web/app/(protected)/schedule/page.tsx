'use client'

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Video, 
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

// Données d'exemple
const upcomingSessions = [
  {
    id: "1",
    title: "Session JavaScript Avancé",
    date: "2024-02-15T14:00:00",
    duration: "1h",
    type: "Mentorat",
    mentor: {
      name: "Sarah Martin",
      image: "/api/placeholder/40/40"
    },
    isOnline: true
  },
  {
    id: "2",
    title: "Préparation Entretien Tech",
    date: "2024-02-16T10:00:00",
    duration: "2h",
    type: "Interview",
    mentor: {
      name: "Thomas Chen",
      image: "/api/placeholder/40/40"
    },
    isOnline: true
  }
]

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
]

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Planning</h1>
          <p className="text-muted-foreground">
            Gérez vos sessions et rendez-vous
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
          >
            {view === 'calendar' ? (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Vue Calendrier
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Vue Liste
              </>
            )}
          </Button>
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Nouvelle session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Calendrier & Sessions à venir */}
        <div className="space-y-6">
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </Card>

          <Card>
            <div className="p-4 border-b">
              <h2 className="font-semibold">Sessions à venir</h2>
            </div>
            <div className="divide-y">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{session.title}</p>
                      <div className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{session.duration}</span>
                        {session.isOnline && (
                          <span className="text-green-600">• En ligne</span>
                        )}
                      </div>
                    </div>
                    <img 
                      src={session.mentor.image}
                      alt={session.mentor.name}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Vue principale */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-semibold">
                {date?.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h2>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {timeSlots.map((time) => (
              <div 
                key={time}
                className="grid grid-cols-[100px_1fr] gap-4 py-2 hover:bg-gray-50 rounded-lg px-2"
              >
                <div className="text-muted-foreground">{time}</div>
                <div className="flex-1 min-h-[40px] rounded-lg border border-dashed border-gray-200 hover:border-blue-500 cursor-pointer transition-colors">
                  {/* Les événements seront affichés ici */}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}