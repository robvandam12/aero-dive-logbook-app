
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';
import { PDFPage1 } from './PDFPage1';
import { PDFPage2 } from './PDFPage2';

interface DiveLogPDFDocumentProps {
  diveLog: DiveLogWithFullDetails;
  hasSignature: boolean;
}

export const DiveLogPDFDocument: React.FC<DiveLogPDFDocumentProps> = ({ diveLog, hasSignature }) => {
  return (
    <Document
      title={`Bitácora de Buceo - ${diveLog.centers?.name || 'Centro'} - ${diveLog.log_date || 'Sin fecha'}`}
      author="Aerocam SPA"
      subject="Bitácora de Buceo"
      creator="Sistema de Bitácoras Aerocam"
      producer="React-PDF"
    >
      <PDFPage1 diveLog={diveLog} />
      <PDFPage2 diveLog={diveLog} hasSignature={hasSignature} />
    </Document>
  );
};
