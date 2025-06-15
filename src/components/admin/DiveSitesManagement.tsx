
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const DiveSitesManagement = () => {
  return (
    <Card className="bg-transparent border-none text-white">
      <CardHeader>
        <CardTitle>Gestionar Puntos de Buceo</CardTitle>
        <CardDescription className="text-ocean-300">
          Añade, edita o elimina los puntos de buceo registrados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Próximamente: Tabla para ver, crear, editar y eliminar puntos de buceo.</p>
      </CardContent>
    </Card>
  );
};
