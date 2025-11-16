import { notFound } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import EngineerProfileDetail from "@/components/engineers/engineer-profile-detail";
import AvailabilityCalendar from "@/components/engineers/availability-calendar";
import { Award, MapPin, Star, GraduationCap, Briefcase } from 'lucide-react';

export default async function EngineerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const engineer = await prisma.engineerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      projects: true,
      availability: {
        where: {
          startTime: {
            gte: new Date(), // only future availabilities
          },
        },
        orderBy: {
          startTime: "asc",
        },
      },
    },
  });

  if (!engineer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">ConexEng</div>
          <div className="flex gap-2">
            <Link href="/dashboard/engineers">
              <Button variant="outline">Voltar</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              {/* Profile Image */}
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                {engineer.profileImage ? (
                  <img
                    src={engineer.profileImage || "/placeholder.svg"}
                    alt={engineer.user?.name || "Engineer"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-6xl font-bold text-primary/40">
                    {engineer.user?.name?.charAt(0) || "E"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-2xl font-bold">{engineer.user?.name}</h1>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{engineer.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({engineer.totalReviews} avaliações)
                    </span>
                  </div>
                </div>

                {engineer.isVerified && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-semibold">Profissional Verificado</span>
                  </div>
                )}

                {engineer.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {engineer.location}
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Taxa Horária</p>
                  <p className="text-2xl font-bold text-primary">R${engineer.hourlyRate}/h</p>
                </div>

                <Button className="w-full mt-4" size="lg">
                  Agendar Consultoria
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Experiência</span>
                  </div>
                  <span className="font-semibold">{engineer.yearsOfExp} anos</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Formação</span>
                  </div>
                </div>

                {engineer.education && (
                  <p className="text-sm font-semibold">{engineer.education}</p>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Sobre</h2>
              <p className="text-foreground leading-relaxed">
                {engineer.bio || "Sem descrição disponível."}
              </p>
            </Card>

            {/* Specialties */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Especialidades</h2>
              <div className="flex flex-wrap gap-2">
                {engineer.specialties.split(",").map(specialty => (
                  <Badge key={specialty.trim()} className="text-sm">
                    {specialty.trim()}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Projects */}
            {engineer.projects && engineer.projects.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Projetos Anteriores</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {engineer.projects.map(project => (
                    <div
                      key={project.id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {project.imageUrl && (
                        <img
                          src={project.imageUrl || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-3">
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.split(",").map(tech => (
                              <Badge key={tech.trim()} variant="secondary" className="text-xs">
                                {tech.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Availability Calendar */}
            <AvailabilityCalendar 
              engineerId={engineer.id}
              availabilities={engineer.availability}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
