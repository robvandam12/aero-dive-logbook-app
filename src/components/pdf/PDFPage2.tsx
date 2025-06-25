
import React from 'react';
import { Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 25,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1px solid #e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  pageTitle: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },
  idBox: {
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 5,
    minWidth: 80,
    textAlign: 'center',
  },
  idLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
  },
  idValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#374151',
    borderLeft: '3px solid #2563eb',
    paddingLeft: 8,
  },
  diverBlock: {
    marginBottom: 12,
    borderRadius: 5,
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
  },
  diverHeader: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diverTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  diverName: {
    fontSize: 9,
    color: '#bfdbfe',
  },
  diverContent: {
    backgroundColor: '#ffffff',
    padding: 12,
    minHeight: 40,
  },
  diverText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  observationsSection: {
    marginBottom: 20,
  },
  observationsBox: {
    backgroundColor: '#f0fdf4',
    borderLeft: '3px solid #22c55e',
    padding: 12,
    borderRadius: 5,
  },
  observationsText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  signaturesSection: {
    marginTop: 'auto',
  },
  signaturesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '48%',
    textAlign: 'center',
  },
  signatureArea: {
    border: '2px dashed #d1d5db',
    borderRadius: 5,
    height: 50,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signaturePlaceholder: {
    fontSize: 8,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  signatureImage: {
    maxHeight: 40,
    maxWidth: '100%',
  },
  signatureLine: {
    borderTop: '2px solid #374151',
    paddingTop: 5,
  },
  signatureLabel: {
    fontSize: 7,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  signatureName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
  },
  digitalSignature: {
    backgroundColor: '#dcfce7',
    border: '1px solid #bbf7d0',
    padding: 6,
    borderRadius: 3,
    marginTop: 5,
    textAlign: 'center',
  },
  digitalSignatureText: {
    fontSize: 7,
    color: '#16a34a',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  digitalSignatureCode: {
    fontSize: 7,
    color: '#15803d',
    fontFamily: 'Courier',
  },
  footer: {
    marginTop: 15,
    paddingTop: 8,
    borderTop: '1px solid #e5e7eb',
  },
  footerBox: {
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 5,
  },
  footerText: {
    fontSize: 7,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 1.3,
    fontStyle: 'italic',
  },
});

interface PDFPage2Props {
  diveLog: DiveLogWithFullDetails;
  hasSignature: boolean;
}

export const PDFPage2: React.FC<PDFPage2Props> = ({ diveLog, hasSignature }) => {
  const diversManifest = Array.isArray(diveLog.divers_manifest) 
    ? diveLog.divers_manifest as any[]
    : [];

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Text style={styles.companyName}>aerocam</Text>
            <Text style={styles.pageTitle}>Bitácora de Buceo - Página 2</Text>
          </View>
        </View>
        <View style={styles.idBox}>
          <Text style={styles.idLabel}>Nº</Text>
          <Text style={styles.idValue}>{diveLog.id?.slice(-6) || ''}</Text>
        </View>
      </View>

      {/* Work Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DETALLE DE TRABAJO REALIZADO POR BUZO</Text>
        
        {[1, 2, 3, 4].map(buzoNum => {
          const diver = diversManifest[buzoNum - 1];
          return (
            <View key={buzoNum} style={styles.diverBlock}>
              <View style={styles.diverHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.diverTitle}>BUZO {buzoNum}</Text>
                  {diver?.name && (
                    <Text style={[styles.diverName, { marginLeft: 10 }]}>
                      {diver.name}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.diverContent}>
                <Text style={styles.diverText}>
                  {diver?.work_description || diver?.work_performed || ''}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* General Observations Section */}
      <View style={styles.observationsSection}>
        <Text style={styles.sectionTitle}>OBSERVACIONES GENERALES</Text>
        <View style={styles.observationsBox}>
          <Text style={styles.observationsText}>
            {diveLog.observations || 'Faena realizada normal, buzos sin novedad.'}
          </Text>
        </View>
      </View>

      {/* Signatures Section */}
      <View style={styles.signaturesSection}>
        <Text style={styles.sectionTitle}>FIRMAS Y AUTORIZACIONES</Text>
        <View style={styles.signaturesGrid}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureArea}>
              <Text style={styles.signaturePlaceholder}>Área de Firma</Text>
            </View>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Nombre y Cargo</Text>
              <Text style={styles.signatureName}>ENCARGADO DE CENTRO</Text>
            </View>
          </View>
          
          <View style={styles.signatureBox}>
            <View style={styles.signatureArea}>
              {hasSignature && diveLog.signature_url ? (
                <Image 
                  src={diveLog.signature_url} 
                  style={styles.signatureImage}
                />
              ) : (
                <Text style={styles.signaturePlaceholder}>Área de Firma y Timbre</Text>
              )}
            </View>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureLabel}>Nombre y Cargo</Text>
              <Text style={styles.signatureName}>SUPERVISOR DE BUCEO</Text>
              {hasSignature && (
                <View style={styles.digitalSignature}>
                  <Text style={styles.digitalSignatureText}>
                    ✓ FIRMADO DIGITALMENTE
                  </Text>
                  <Text style={styles.digitalSignatureCode}>
                    Código: DL-{diveLog.id?.slice(0, 8).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerBox}>
          <Text style={styles.footerText}>
            Este documento contiene información confidencial de Aerocam SPA. 
            Queda prohibida su reproducción, distribución o transformación sin autorización expresa.
          </Text>
        </View>
      </View>
    </Page>
  );
};
