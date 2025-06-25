
import { createRoot } from 'react-dom/client';
import { DiveLogWithFullDetails } from '@/hooks/useDiveLog';
import { PrintableDiveLogPaginated } from '@/components/PrintableDiveLogPaginated';

export const createTempPDFContainer = (diveLogData: DiveLogWithFullDetails, hasSignature: boolean) => {
  const tempContainer = document.createElement('div');
  tempContainer.id = 'temp-pdf-container';
  tempContainer.style.cssText = `
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 816px;
    height: auto;
    background: white;
    z-index: -1;
    opacity: 0;
    visibility: hidden;
    overflow: visible;
    transform: none;
    pointer-events: none;
  `;
  
  document.body.appendChild(tempContainer);
  
  return tempContainer;
};

export const renderPDFComponent = async (container: HTMLElement, diveLogData: DiveLogWithFullDetails, hasSignature: boolean) => {
  const root = createRoot(container);
  
  return new Promise<void>((resolve, reject) => {
    root.render(
      <div style={{ 
        width: '816px', 
        height: 'auto',
        background: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.2',
        color: '#000'
      }}>
        <PrintableDiveLogPaginated 
          diveLog={diveLogData} 
          hasSignature={hasSignature}
          isTemporary={true}
        />
      </div>
    );
    
    // Wait for React to render
    setTimeout(() => {
      const content = container.textContent || '';
      if (content.trim().length > 100) {
        console.log("React component rendered successfully, content length:", content.length);
        resolve();
      } else {
        reject(new Error("React component not properly rendered"));
      }
    }, 2000);
  });
};

export const generatePDFFilename = (diveLogData: DiveLogWithFullDetails): string => {
  const dateStr = diveLogData.log_date ? new Date(diveLogData.log_date).toISOString().split('T')[0] : 'sin-fecha';
  const centerName = diveLogData.centers?.name ? diveLogData.centers.name.replace(/[^a-zA-Z0-9]/g, '-') : 'sin-centro';
  return `bitacora-${centerName}-${dateStr}-${diveLogData.id?.slice(-6)}.pdf`;
};

export const cleanupTempContainer = (container: HTMLElement) => {
  if (document.body.contains(container)) {
    document.body.removeChild(container);
  }
};
