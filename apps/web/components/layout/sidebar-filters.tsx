"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const filters = {
  level: ["Débutant", "Intermédiaire", "Avancé"],
  duration: ["< 2h", "2-5h", "5-10h", "> 10h"],
  type: ["Cours", "Atelier", "Certification"],
  tags: ["React", "Node.js", "Python", "Java", "DevOps", "Cloud"]
}

export function SidebarFilters() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || []
      if (current.includes(value)) {
        return {
          ...prev,
          [category]: current.filter(v => v !== value)
        }
      }
      return {
        ...prev,
        [category]: [...current, value]
      }
    })
  }

  return (
    <div className="space-y-4">
      {Object.entries(filters).map(([category, options]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-${option}`}
                  checked={selectedFilters[category]?.includes(option)}
                  onCheckedChange={() => handleFilterChange(category, option)}
                />
                <label
                  htmlFor={`${category}-${option}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}