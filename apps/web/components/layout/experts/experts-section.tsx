"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const mockExperts = [
  {
    id: '1',
    name: 'John Doe',
    avatar: '/experts/1.jpg',
    expertise: ['React', 'Node.js', 'TypeScript'],
    hourlyRate: 75,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: '2',
    name: 'Sarah Smith',
    avatar: '/experts/2.jpg',
    expertise: ['Python', 'Machine Learning', 'Data Science'],
    hourlyRate: 90,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: '/experts/3.jpg',
    expertise: ['Java', 'Spring Boot', 'Microservices'],
    hourlyRate: 85,
    rating: 4.7,
    reviews: 156,
  },
  // ... ajoutez plus d'experts selon vos besoins
];

const domains = [
  'All',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'DevOps',
  'Cloud',
  'Security',
  'UI/UX',
];

export function ExpertsSection() {
  const [selectedDomain, setSelectedDomain] = useState('All');

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Experts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos experts hautement qualifiés, prêts à partager leurs connaissances et leur expérience avec vous.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-12 overflow-x-auto">
          <div className="flex gap-2 min-w-max justify-center">
            {domains.map((domain) => (
              <Button
                key={domain}
                variant={selectedDomain === domain ? "default" : "outline"}
                onClick={() => setSelectedDomain(domain)}
                className="whitespace-nowrap"
              >
                {domain}
              </Button>
            ))}
          </div>
        </div>

        {/* Grille d'experts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockExperts.map((expert) => (
            <Card key={expert.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={expert.avatar} alt={expert.name} />
                      <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{expert.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        ⭐ {expert.rating} ({expert.reviews})
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {expert.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="text-sm text-muted-foreground">
                  À partir de ${expert.hourlyRate}/heure
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 p-6">
                <Button className="w-full">
                  Réserver une session
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Voir plus */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Voir plus d'experts
          </Button>
        </div>
      </div>
    </section>
  );
}