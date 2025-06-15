
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const BoatsManagement = () => {
  return (
    <Card className="bg-transparent border-none text-white">
      <CardHeader>
        <CardTitle>Gestionar Embarcaciones</CardTitle>
        <CardDescription className="text-ocean-300">
          Añade, edita o elimina las embarcaciones asociadas a cada centro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Próximamente: Tabla para ver, crear, editar y eliminar embarcaciones.</p>
      </CardContent>
    </Card>
  );
};
