
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Save, FileSignature } from "lucide-react";

const steps = [
  { id: 1, title: 'Datos Generales', description: 'Información básica de la bitácora' },
  { id: 2, title: 'Condiciones', description: 'Tiempo y equipos compresores' },
  { id: 3, title: 'Equipo de Buceo', description: 'Buzos y personal involucrado' },
  { id: 4, title: 'Detalle de Trabajos', description: 'Actividades realizadas' },
  { id: 5, title: 'Observaciones', description: 'Comentarios finales y firma' }
];

export const DiveLogWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha" className="text-ocean-300">Fecha</Label>
                <Input 
                  id="fecha" 
                  type="date" 
                  className="bg-ocean-950/50 border-ocean-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="centro" className="text-ocean-300">Centro</Label>
                <Select>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                  <SelectContent className="bg-ocean-900 border-ocean-700">
                    <SelectItem value="valparaiso">Puerto Valparaíso</SelectItem>
                    <SelectItem value="san-antonio">Puerto San Antonio</SelectItem>
                    <SelectItem value="talcahuano">Puerto Talcahuano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor" className="text-ocean-300">Supervisor de Buceo</Label>
              <Input 
                id="supervisor" 
                placeholder="Nombre del supervisor"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condicion-tiempo" className="text-ocean-300">Condición del Tiempo</Label>
                <Select>
                  <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-ocean-900 border-ocean-700">
                    <SelectItem value="bueno">Bueno</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="malo">Malo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="viento" className="text-ocean-300">Viento (nudos)</Label>
                <Input 
                  id="viento" 
                  type="number"
                  placeholder="0"
                  className="bg-ocean-950/50 border-ocean-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oleaje" className="text-ocean-300">Oleaje (m)</Label>
                <Input 
                  id="oleaje" 
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="bg-ocean-950/50 border-ocean-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-ocean-300">Compresores Utilizados</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="compresor-1" className="text-sm text-ocean-400">Compresor #1</Label>
                  <Input 
                    id="compresor-1" 
                    placeholder="Número de serie"
                    className="bg-ocean-950/50 border-ocean-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compresor-2" className="text-sm text-ocean-400">Compresor #2</Label>
                  <Input 
                    id="compresor-2" 
                    placeholder="Número de serie"
                    className="bg-ocean-950/50 border-ocean-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-white">Equipo de Buceo</h4>
                <Button variant="outline" size="sm" className="border-ocean-600 text-ocean-300">
                  Agregar Buzo
                </Button>
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                  <Card key={index} className="glass">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-ocean-300">Nombre</Label>
                          <Input 
                            placeholder="Nombre completo"
                            className="bg-ocean-950/50 border-ocean-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ocean-300">Matrícula</Label>
                          <Input 
                            placeholder="Matrícula"
                            className="bg-ocean-950/50 border-ocean-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ocean-300">Puesto</Label>
                          <Select>
                            <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                              <SelectValue placeholder="Puesto" />
                            </SelectTrigger>
                            <SelectContent className="bg-ocean-900 border-ocean-700">
                              <SelectItem value="buzo">Buzo</SelectItem>
                              <SelectItem value="buzo-emergencia">Buzo de Emergencia</SelectItem>
                              <SelectItem value="supervisor">Supervisor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-ocean-300">Prof. Trabajo (m)</Label>
                          <Input 
                            type="number"
                            placeholder="0"
                            className="bg-ocean-950/50 border-ocean-700 text-white"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-faena" className="text-ocean-300">Tipo de Faena</Label>
              <Select>
                <SelectTrigger className="bg-ocean-950/50 border-ocean-700 text-white">
                  <SelectValue placeholder="Seleccionar tipo de faena" />
                </SelectTrigger>
                <SelectContent className="bg-ocean-900 border-ocean-700">
                  <SelectItem value="inspeccion">Inspección</SelectItem>
                  <SelectItem value="soldadura">Soldadura Subacuática</SelectItem>
                  <SelectItem value="corte">Corte Subacuático</SelectItem>
                  <SelectItem value="limpieza">Limpieza de Casco</SelectItem>
                  <SelectItem value="reparacion">Reparación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="embarcacion" className="text-ocean-300">Embarcación</Label>
              <Input 
                id="embarcacion" 
                placeholder="Nombre de la embarcación"
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalle-trabajos" className="text-ocean-300">Detalle de Trabajos Realizados</Label>
              <Textarea 
                id="detalle-trabajos"
                placeholder="Describa detalladamente los trabajos realizados..."
                rows={6}
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="observaciones" className="text-ocean-300">Observaciones Generales</Label>
              <Textarea 
                id="observaciones"
                placeholder="Observaciones adicionales, incidentes, recomendaciones..."
                rows={4}
                className="bg-ocean-950/50 border-ocean-700 text-white"
              />
            </div>
            
            <div className="border-t border-ocean-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-white">Firma de Supervisor</h4>
                <Badge variant="outline" className="border-gold-500 text-gold-400">
                  Requerida
                </Badge>
              </div>
              <p className="text-sm text-ocean-400 mb-4">
                La firma digital es requerida para finalizar la bitácora. Una vez firmada, 
                podrá proceder al envío de la documentación.
              </p>
              <Button className="bg-ocean-gradient hover:opacity-90">
                <FileSignature className="w-4 h-4 mr-2" />
                Firmar Bitácora
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-medium
              ${currentStep >= step.id 
                ? 'bg-ocean-gradient text-white' 
                : 'bg-ocean-800 text-ocean-400'
              }
            `}>
              {step.id}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                w-16 h-1 mx-2
                ${currentStep > step.id ? 'bg-ocean-500' : 'bg-ocean-800'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {steps[currentStep - 1].title}
        </h2>
        <p className="text-ocean-300">
          {steps[currentStep - 1].description}
        </p>
      </div>

      {/* Step Content */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-white">
            Paso {currentStep} de {steps.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Borrador
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={nextStep}
              className="bg-ocean-gradient hover:opacity-90"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="bg-gold-gradient hover:opacity-90">
              <FileSignature className="w-4 h-4 mr-2" />
              Finalizar Bitácora
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
