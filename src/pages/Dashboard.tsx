
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { StatsCard } from "@/components/StatsCard";
import { Ship, Anchor, Waves, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth'); // Redirect to login after logout
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 min-h-screen bg-background ocean-pattern">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Button onClick={() => navigate('/new-dive-log')} className="bg-ocean-gradient hover:opacity-90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Bitácora
          </Button>
          <div className="flex items-center space-x-2">
            <p className="text-muted-foreground">{user?.email}</p>
            <Button onClick={handleLogout} variant="secondary">Logout</Button>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Bitácoras Hoy"
          value="12"
          description="2 más que ayer"
          icon={Ship}
          color="ocean"
        />
        <StatsCard
          title="Centros de Buceo Activos"
          value="4"
          icon={Anchor}
          color="gold"
        />
        <StatsCard
          title="Embarcaciones"
          value="8"
          icon={Waves}
          color="emerald"
        />
      </div>
    </div>
  );
};

export default Dashboard;
