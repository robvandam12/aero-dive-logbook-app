
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const CentersManagement = () => {
  return (
    <Card className="bg-transparent border-none text-white">
      <CardHeader>
        <CardTitle>Gestionar Centros de Buceo</CardTitle>
        <CardDescription className="text-ocean-300">
          Añade, edita o elimina los centros de buceo disponibles en el sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Próximamente: Tabla para ver, crear, editar y eliminar centros.</p>
      </CardContent>
    </Card>
  );
};
