"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Type pour les créneaux horaires
interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  day: string
  isAvailable: boolean
}

interface ScheduleProps {
  mentorId: string
  initialSchedule?: TimeSlot[]
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
]

export function MentorSchedule({ mentorId, initialSchedule = [] }: ScheduleProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>(initialSchedule)
  const [selectedTimeRange, setSelectedTimeRange] = useState({
    start: "",
    end: ""
  })

  // Ajouter un créneau horaire
  const addTimeSlot = () => {
    if (!date || !selectedTimeRange.start || !selectedTimeRange.end) return

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: selectedTimeRange.start,
      endTime: selectedTimeRange.end,
      day: date.toISOString().split('T')[0],
      isAvailable: true
    }

    setSelectedSlots([...selectedSlots, newSlot])
  }

  // Supprimer un créneau horaire
  const removeTimeSlot = (slotId: string) => {
    setSelectedSlots(selectedSlots.filter(slot => slot.id !== slotId))
  }

  // Obtenir les créneaux pour un jour spécifique
  const getSlotsForDay = (day: string) => {
    return selectedSlots.filter(slot => slot.day === day)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendrier */}
      <Card>
        <CardHeader>
          <CardTitle>Sélectionnez une date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Gestion des créneaux */}
      <Card>
        <CardHeader>
          <CardTitle>Créneaux horaires disponibles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sélection du créneau */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              onValueChange={(value) => setSelectedTimeRange(prev => ({...prev, start: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Début" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(time => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => setSelectedTimeRange(prev => ({...prev, end: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Fin" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(time => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={addTimeSlot}
            className="w-full"
            disabled={!date || !selectedTimeRange.start || !selectedTimeRange.end}
          >
            Ajouter ce créneau
          </Button>

          {/* Liste des créneaux */}
          {date && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">
                Créneaux du {date.toLocaleDateString()}
              </h4>
              <div className="space-y-2">
                {getSlotsForDay(date.toISOString().split('T')[0]).map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-2 rounded bg-gray-50"
                  >
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimeSlot(slot.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="col-span-full">
        <Button 
          className="w-full"
          onClick={() => {
            // Ici, vous pouvez ajouter la logique pour sauvegarder l'emploi du temps
            console.log('Enregistrement des créneaux:', selectedSlots)
          }}
        >
          Enregistrer mon emploi du temps
        </Button>
      </div>
    </div>
  )
}