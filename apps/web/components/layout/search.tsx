"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search as SearchIcon, X } from "lucide-react"

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implémentation de la recherche
    console.log("Recherche:", query)
  }

  return (
    <div className="w-full max-w-md">
      {isOpen ? (
        <form onSubmit={onSearch} className="relative">
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}