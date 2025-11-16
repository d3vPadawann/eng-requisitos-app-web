import { notFound } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import EngineerSearch from "@/components/engineers/engineer-search";

export default function EngineersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">ConexEng</div>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Encontre Engenheiros Especializados</h1>
            <p className="text-muted-foreground">
              Filtro por especialidade e localização para encontrar o profissional perfeito para seu projeto.
            </p>
          </div>

          {/* Search Component */}
          <EngineerSearch />
        </div>
      </main>
    </div>
  );
}
