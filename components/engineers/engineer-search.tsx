"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Star, Award } from 'lucide-react';

interface Engineer {
  id: string;
  userId: string;
  bio: string | null;
  specialties: string;
  location: string | null;
  hourlyRate: number;
  yearsOfExp: number;
  profileImage: string | null;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  user: {
    name: string | null;
  };
}

export default function EngineerSearch() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Fetch engineers on component mount
  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await fetch("/api/engineers");
        const data = await response.json();
        
        if (data.engineers) {
          setEngineers(data.engineers);
          
          // Extract unique specialties and locations
          const uniqueSpecialties = new Set<string>();
          const uniqueLocations = new Set<string>();
          
          data.engineers.forEach((eng: Engineer) => {
            if (eng.specialties) {
              eng.specialties.split(",").forEach(s => uniqueSpecialties.add(s.trim()));
            }
            if (eng.location) {
              uniqueLocations.add(eng.location);
            }
          });
          
          setSpecialties(Array.from(uniqueSpecialties).sort());
          setLocations(Array.from(uniqueLocations).sort());
        }
      } catch (error) {
        console.error("Error fetching engineers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  // Filter engineers based on search criteria
  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = 
      engineer.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.specialties.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = 
      selectedSpecialty === "all" ||
      engineer.specialties.includes(selectedSpecialty);
    
    const matchesLocation = 
      selectedLocation === "all" ||
      engineer.location === selectedLocation;
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Buscar por nome, especialidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="col-span-1 md:col-span-1"
        />
        
        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Especialidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Especialidades</SelectItem>
            {specialties.map(spec => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Localização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Localidades</SelectItem>
            {locations.map(loc => (
              <SelectItem key={loc} value={loc}>{loc}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        {filteredEngineers.length} profissional{filteredEngineers.length !== 1 ? "is" : ""} encontrado{filteredEngineers.length !== 1 ? "s" : ""}
      </div>

      {/* Engineers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngineers.map(engineer => (
          <Card key={engineer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Profile Image */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              {engineer.profileImage ? (
                <img 
                  src={engineer.profileImage || "/placeholder.svg"} 
                  alt={engineer.user?.name || "Engineer"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl font-bold text-primary/40">
                  {engineer.user?.name?.charAt(0) || "E"}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Name and Verification */}
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-lg">{engineer.user?.name || "Engenheiro"}</h3>
                {engineer.isVerified && (
                  <Award className="w-5 h-5 text-green-500" />
                )}
              </div>

              {/* Location */}
              {engineer.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {engineer.location}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{engineer.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({engineer.totalReviews} avaliações)</span>
              </div>

              {/* Experience and Rate */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{engineer.yearsOfExp} anos de experiência</span>
                <span className="font-bold text-foreground">R${engineer.hourlyRate}/h</span>
              </div>

              {/* Specialties */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {engineer.specialties.split(",").map(spec => (
                    <Badge key={spec.trim()} variant="secondary" className="text-xs">
                      {spec.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              {engineer.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {engineer.bio}
                </p>
              )}

              {/* View Profile Button */}
              <Link href={`/dashboard/engineers/${engineer.id}`}>
                <Button className="w-full mt-4">Ver Perfil Completo</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredEngineers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Nenhum profissional encontrado com esses critérios. Tente ajustar seus filtros.
          </p>
        </Card>
      )}
    </div>
  );
}
