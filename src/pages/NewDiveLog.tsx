
import { DiveLogWizard } from "@/components/DiveLogWizard";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const NewDiveLogPage = () => {
  return (
    <div className="min-h-screen bg-hero-gradient ocean-pattern">
      <Header />
      <main className="container mx-auto px-6 py-8 space-y-8">
        <Button asChild variant="outline" className="border-ocean-600 text-ocean-300 hover:bg-ocean-800">
          <Link to="/dashboard">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
        </Button>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Nueva Bitácora de Buceo
          </h1>
          <p className="text-xl text-ocean-300 max-w-2xl mx-auto">
            Complete los siguientes pasos para registrar una nueva faena.
          </p>
        </div>
        <DiveLogWizard />
      </main>
    </div>
  );
};

export default NewDiveLogPage;
