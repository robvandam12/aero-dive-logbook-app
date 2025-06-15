
import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, RotateCcw, Check } from "lucide-react";

interface DigitalSignatureProps {
  onSave?: (signatureData: string) => void;
  width?: number;
  height?: number;
}

export const DigitalSignature = ({ 
  onSave, 
  width = 400, 
  height = 200 
}: DigitalSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar el canvas
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fondo transparente
    ctx.fillStyle = 'rgba(12, 74, 110, 0.1)';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(12, 74, 110, 0.1)';
      ctx.fillRect(0, 0, width, height);
    }
    setHasSignature(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const signatureData = canvas.toDataURL('image/png');
    onSave?.(signatureData);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-white">Firma Digital</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border-2 border-dashed border-ocean-600 rounded-lg cursor-crosshair bg-ocean-950/20"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-ocean-400 text-sm">Firme aquí con su dedo o mouse</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
            >
              <Trash className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              className="border-ocean-600 text-ocean-300 hover:bg-ocean-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Deshacer
            </Button>
          </div>
          
          <Button
            onClick={saveSignature}
            disabled={!hasSignature}
            className="bg-ocean-gradient hover:opacity-90"
          >
            <Check className="w-4 h-4 mr-2" />
            Guardar Firma
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
