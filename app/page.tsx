import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-indigo-600">ConexEng</div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Registrar</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900">
            Conexão com Profissionais Especializados
          </h1>
          <p className="text-xl text-gray-600">
            ConexEng conecta clientes com engenheiros altamente qualificados para consultoria especializada. 
            Uma plataforma de confiança para suas necessidades técnicas.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/auth/signup">
              <Button size="lg" className="px-8">
                Começar Agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8">
              Saber Mais
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Para Clientes</h3>
            <p className="text-gray-600">
              Encontre profissionais verificados, visualize disponibilidade em tempo real e agende consultoria de forma fácil.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Para Engenheiros</h3>
            <p className="text-gray-600">
              Compartilhe seu perfil, gerencie sua agenda e cresça sua carreira conectando-se com clientes qualificados.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Segurança</h3>
            <p className="text-gray-600">
              Perfis verificados, sistema de pagamento seguro e suporte 24/7 para garantir sua confiança.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
