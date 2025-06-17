
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/button";
import { Ship, Anchor, Waves, Shield, Users, BarChart3 } from "lucide-react";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir usuarios autenticados al dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Ship,
      title: "Bitácoras Digitales",
      description: "Registro completo de actividades de buceo con firmas digitales"
    },
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Sistema seguro con códigos únicos de validación"
    },
    {
      icon: Users,
      title: "Gestión de Equipos",
      description: "Control completo de supervisores y buzos"
    },
    {
      icon: BarChart3,
      title: "Reportes Operativos",
      description: "Análisis detallados de rendimiento y operaciones"
    },
    {
      icon: Anchor,
      title: "Multi-Centro",
      description: "Gestión de múltiples centros de buceo"
    },
    {
      icon: Waves,
      title: "Trazabilidad Completa",
      description: "Seguimiento detallado de todas las operaciones"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-950 via-ocean-900 to-slate-900">
      {/* Header */}
      <header className="bg-ocean-950/50 backdrop-blur-sm border-b border-ocean-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#6555FF] to-purple-700 rounded-lg flex items-center justify-center">
                <Anchor className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Aerocam App</h1>
            </div>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Anchor className="w-16 h-16 text-[#6555FF]" />
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#6555FF] to-purple-700 bg-clip-text text-transparent">
              Sistema de Bitácoras de Buceo
            </h2>
          </div>
          <span className="block text-3xl text-ocean-300 mt-2 mb-6">
            Profesional y Seguro
          </span>
          <p className="text-xl text-ocean-200 mb-8 max-w-2xl mx-auto">
            Gestiona de manera eficiente todas las operaciones de buceo con nuestro sistema 
            integral de bitácoras digitales, reportes y trazabilidad completa.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-[#6555FF] to-purple-700 hover:opacity-90 text-lg px-8 py-3"
          >
            Comenzar Ahora
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Características Principales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-ocean-950/30 backdrop-blur-sm rounded-lg p-6 border border-ocean-800 hover:border-[#6555FF]/50 transition-all duration-300">
                <feature.icon className="w-12 h-12 text-[#6555FF] mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-ocean-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-ocean-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Anchor className="w-5 h-5 text-ocean-400" />
            <p className="text-ocean-400">
              © 2025 Aerocam App. Sistema profesional de gestión de bitácoras de buceo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
