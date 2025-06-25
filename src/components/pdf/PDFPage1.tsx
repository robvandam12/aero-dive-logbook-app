
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  companyInfo: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 15,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  companySubtitle: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
  },
  dateBox: {
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  dateLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 5,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  centerBox: {
    backgroundColor: '#dbeafe',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  centerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
    borderLeft: '4px solid #2563eb',
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 10,
    color: '#111827',
    borderBottom: '1px solid #d1d5db',
    paddingBottom: 3,
  },
  weatherSection: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  weatherTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '1px solid #6b7280',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkboxText: {
    fontSize: 8,
    color: '#ffffff',
  },
  checkboxLabel: {
    fontSize: 10,
    marginRight: 15,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 7,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #d1d5db',
    minHeight: 25,
  },
  tableRowEven: {
    backgroundColor: '#f9fafb',
  },
  tableCellHeader: {
    padding: 5,
    textAlign: 'center',
    borderRight: '1px solid #1d4ed8',
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    borderRight: '1px solid #d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellText: {
    fontSize: 8,
    textAlign: 'center',
  },
  tableCellLeft: {
    textAlign: 'left',
  },
  note: {
    fontSize: 7,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 5,
  },
});

interface PDFPage1Props {
  diveLog: DiveLogWithFullDetails;
}

export const PDFPage1: React.FC<PDFPage1Props> = ({ diveLog }) => {
  const diversManifest = Array.isArray(diveLog.divers_manifest) 
    ? diveLog.divers_manifest as any[]
    : [];

  const tableColumns = [
    { key: 'num', label: '#', width: '8%' },
    { key: 'name', label: 'IDENTIFICACIÓN', width: '25%' },
    { key: 'license', label: 'MATRÍCULA', width: '15%' },
    { key: 'role', label: 'CARGO', width: '12%' },
    { key: 'standard', label: 'ESTÁNDAR\n(≤20m)', width: '15%' },
    { key: 'depth', label: 'PROF.', width: '8%' },
    { key: 'start', label: 'INICIO', width: '8%' },
    { key: 'end', label: 'TÉRMINO', width: '8%' },
    { key: 'time', label: 'TIEMPO', width: '8%' },
  ];

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>aerocam</Text>
          <Text style={styles.companySubtitle}>SOCIEDAD DE SERVICIOS AEROCAM SPA</Text>
          <Text style={styles.companySubtitle}>Ignacio Carrera Pinto Nº 200, Quellón – Chiloé</Text>
          <Text style={styles.companySubtitle}>(65) 2 353 322 • contacto@aerocamchile.cl • www.aerocamchile.cl</Text>
        </View>
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>Fecha</Text>
          <Text style={styles.dateValue}>{diveLog.log_date || ''}</Text>
          <Text style={styles.dateLabel}>Nº</Text>
          <Text style={[styles.dateValue, { color: '#2563eb' }]}>{diveLog.id?.slice(-6) || ''}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>BITÁCORA BUCEO E INFORME DE TRABAJO REALIZADO</Text>

      {/* Center Info */}
      <View style={styles.centerBox}>
        <Text style={styles.centerText}>
          Centro de Cultivo: {diveLog.centers?.name || 'N/A'}
        </Text>
      </View>

      {/* General Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATOS GENERALES</Text>
        
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Supervisor</Text>
            <Text style={styles.value}>{diveLog.profiles?.username || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Jefe de Centro</Text>
            <Text style={styles.value}>{diveLog.center_manager || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>N° Matrícula</Text>
            <Text style={styles.value}>{diveLog.supervisor_license || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Asistente de Centro</Text>
            <Text style={styles.value}>{diveLog.center_assistant || 'N/A'}</Text>
          </View>
        </View>

        {/* Weather Section */}
        <View style={styles.weatherSection}>
          <Text style={styles.weatherTitle}>CONDICIÓN TIEMPO VARIABLES</Text>
          <View style={styles.weatherRow}>
            <View style={[styles.checkbox, diveLog.weather_good === true && styles.checkboxChecked]}>
              {diveLog.weather_good === true && <Text style={styles.checkboxText}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Favorable</Text>
            
            <View style={[styles.checkbox, diveLog.weather_good === false && styles.checkboxChecked]}>
              {diveLog.weather_good === false && <Text style={styles.checkboxText}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Desfavorable</Text>
            
            <View style={[styles.column, { marginLeft: 20 }]}>
              <Text style={styles.label}>Observaciones</Text>
              <Text style={styles.value}>{diveLog.weather_conditions || 'Buen tiempo'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Compresor 1</Text>
            <Text style={styles.value}>{diveLog.compressor_1 || ''}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Compresor 2</Text>
            <Text style={styles.value}>{diveLog.compressor_2 || ''}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Hora de Inicio</Text>
            <Text style={styles.value}>{diveLog.start_time || diveLog.departure_time || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Hora de Término</Text>
            <Text style={styles.value}>{diveLog.end_time || diveLog.arrival_time || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>N° Solicitud de Faena</Text>
            <Text style={styles.value}>{diveLog.work_order_number || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Team Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TEAM DE BUCEO</Text>
        <Text style={[styles.label, { textAlign: 'center', marginBottom: 10 }]}>
          Composición de Equipo Buzos y Asistentes
        </Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            {tableColumns.map((col, index) => (
              <View key={col.key} style={[styles.tableCellHeader, { width: col.width }]}>
                <Text style={{ fontSize: 7, textAlign: 'center' }}>{col.label}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {[1, 2, 3, 4].map((buzoNum, index) => {
            const diver = diversManifest[buzoNum - 1];
            const isEven = index % 2 === 0;
            
            return (
              <View key={buzoNum} style={[styles.tableRow, isEven && styles.tableRowEven]}>
                <View style={[styles.tableCell, { width: '8%' }]}>
                  <Text style={[styles.tableCellText, { fontWeight: 'bold', color: '#2563eb' }]}>
                    {buzoNum}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: '25%' }]}>
                  <Text style={[styles.tableCellText, styles.tableCellLeft]}>
                    {diver?.name || ''}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: '15%' }]}>
                  <Text style={styles.tableCellText}>{diver?.license || ''}</Text>
                </View>
                <View style={[styles.tableCell, { width: '12%' }]}>
                  <Text style={styles.tableCellText}>{diver?.role || ''}</Text>
                </View>
                <View style={[styles.tableCell, { width: '15%' }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={[styles.checkbox, { width: 8, height: 8, marginRight: 3 }, diver?.standard_depth === true && styles.checkboxChecked]}>
                      {diver?.standard_depth === true && <Text style={[styles.checkboxText, { fontSize: 6 }]}>✓</Text>}
                    </View>
                    <Text style={{ fontSize: 6, marginRight: 5 }}>Sí</Text>
                    <View style={[styles.checkbox, { width: 8, height: 8, marginRight: 3 }, diver?.standard_depth === false && styles.checkboxChecked]}>
                      {diver?.standard_depth === false && <Text style={[styles.checkboxText, { fontSize: 6 }]}>✓</Text>}
                    </View>
                    <Text style={{ fontSize: 6 }}>No</Text>
                  </View>
                </View>
                <View style={[styles.tableCell, { width: '8%' }]}>
                  <Text style={styles.tableCellText}>{diver?.working_depth || ''}</Text>
                </View>
                <View style={[styles.tableCell, { width: '8%' }]}>
                  <Text style={styles.tableCellText}>{diver?.start_time || ''}</Text>
                </View>
                <View style={[styles.tableCell, { width: '8%' }]}>
                  <Text style={styles.tableCellText}>{diver?.end_time || ''}</Text>
                </View>
                <View style={[styles.tableCell, { width: '8%' }]}>
                  <Text style={styles.tableCellText}>{diver?.dive_time || ''}</Text>
                </View>
              </View>
            );
          })}
        </View>
        
        <Text style={styles.note}>* Capacidad máxima permitida: 20 metros de profundidad</Text>
      </View>
    </Page>
  );
};
