
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-hero-gradient ocean-pattern">
      <Header />
      <main className="container mx-auto px-6 py-8 flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 88px)' }}>
        <div>
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-xl text-ocean-300 mb-8">¡Vaya! Parece que esta página se perdió en las profundidades.</p>
          <Button asChild className="bg-ocean-gradient hover:opacity-90">
            <Link to="/">Volver a la Superficie</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
