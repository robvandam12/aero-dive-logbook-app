
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Shield, BarChart3, Users, CheckCircle, Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: Ship,
      title: "Gestión de Bitácoras",
      description: "Crea, edita y gestiona bitácoras de buceo de manera profesional"
    },
    {
      icon: Shield,
      title: "Firmas Digitales",
      description: "Sistema seguro de firmas digitales con códigos únicos de verificación"
    },
    {
      icon: BarChart3,
      title: "Reportes Avanzados",
      description: "Análisis detallado de operaciones con gráficos interactivos"
    },
    {
      icon: Users,
      title: "Multi-Centro",
      description: "Gestión centralizada para múltiples centros de buceo"
    }
  ];

  const benefits = [
    "Control total de operaciones de buceo",
    "Cumplimiento de normativas de seguridad",
    "Trazabilidad completa de actividades",
    "Reportes automáticos para autoridades",
    "Interface intuitiva y fácil de usar",
    "Acceso desde cualquier dispositivo"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-xl">
                <img 
                  src="/lovable-uploads/acb40eaa-dea4-4b1a-bcf0-2f102558239e.png" 
                  alt="Aerocam Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">AerocamApp</h1>
            </div>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Sistema Profesional de
              <span className="block bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Bitácoras de Buceo
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Gestiona operaciones de buceo de manera segura, eficiente y con total trazabilidad. 
              Cumple con normativas y mantén el control total de tus actividades.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 text-lg"
            >
              Comenzar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Funcionalidades Principales
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar operaciones de buceo profesionales
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <div className="bg-gold-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                ¿Por qué elegir AerocamApp?
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Desarrollado específicamente para centros de buceo profesionales, 
                nuestro sistema garantiza eficiencia y cumplimiento normativo.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0" />
                    <span className="text-white/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8">
                <div className="text-center">
                  <Anchor className="w-16 h-16 text-gold-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">¿Listo para comenzar?</h3>
                  <p className="text-white/70 mb-6">
                    Únete a los centros de buceo que ya confían en AerocamApp
                  </p>
                  <Button 
                    onClick={handleGetStarted}
                    className="bg-gold-500 hover:bg-gold-600 text-white w-full"
                  >
                    Acceder al Sistema
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/acb40eaa-dea4-4b1a-bcf0-2f102558239e.png" 
              alt="Aerocam Logo" 
              className="w-6 h-6 object-contain"
            />
            <span className="text-white font-semibold">AerocamApp</span>
          </div>
          <p className="text-white/60">
            © 2024 AerocamApp - Sistema Profesional de Gestión de Bitácoras de Buceo
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
