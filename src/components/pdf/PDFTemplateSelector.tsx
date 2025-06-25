
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Star } from "lucide-react";

interface PDFTemplateSelectorProps {
  selectedTemplate: 'basic' | 'professional';
  onTemplateChange: (template: 'basic' | 'professional') => void;
}

export const PDFTemplateSelector = ({ selectedTemplate, onTemplateChange }: PDFTemplateSelectorProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={selectedTemplate === 'basic' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTemplateChange('basic')}
        className="flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Básico
      </Button>
      <Button
        variant={selectedTemplate === 'professional' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTemplateChange('professional')}
        className="flex items-center gap-2"
      >
        <Star className="w-4 h-4" />
        Profesional
      </Button>
    </div>
  );
};
