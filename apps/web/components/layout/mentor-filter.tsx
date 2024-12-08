"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"

const specialties = ["React", "Node.js", "Python", "Java", "Cloud", "DevOps"]
const availability = ["Aujourd'hui", "Cette semaine", "Ce mois-ci"]
const priceRanges = ["< 50€/h", "50-100€/h", "> 100€/h"]

export function MentorFilter() {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Spécialités</DropdownMenuLabel>
        {specialties.map((specialty) => (
          <DropdownMenuCheckboxItem
            key={specialty}
            checked={selectedSpecialties.includes(specialty)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedSpecialties([...selectedSpecialties, specialty])
              } else {
                setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty))
              }
            }}
          >
            {specialty}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Disponibilité</DropdownMenuLabel>
        {availability.map((time) => (
          <DropdownMenuCheckboxItem
            key={time}
            checked={selectedAvailability.includes(time)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedAvailability([...selectedAvailability, time])
              } else {
                setSelectedAvailability(selectedAvailability.filter((t) => t !== time))
              }
            }}
          >
            {time}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Tarif horaire</DropdownMenuLabel>
        {priceRanges.map((range) => (
          <DropdownMenuCheckboxItem
            key={range}
            checked={selectedPriceRanges.includes(range)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedPriceRanges([...selectedPriceRanges, range])
              } else {
                setSelectedPriceRanges(selectedPriceRanges.filter((r) => r !== range))
              }
            }}
          >
            {range}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}