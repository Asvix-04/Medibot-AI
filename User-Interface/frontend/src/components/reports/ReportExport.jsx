import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const ReportExport = ({ 
  reportRef, 
  fileName = 'health-report', 
  healthData, 
  selectedMetrics,
  darkMode 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Generate PDF from report DOM
  const generatePDF = async () => {
    if (!reportRef.current) {
      console.error('Report reference is not available');
      setExportError('Report reference is not available');
      return;
    }
    
    setIsExporting(true);
    setExportError(null);
    
    try {
      console.log("Starting PDF generation");
      
      // Make sure the report is visible when capturing
      const originalDisplay = reportRef.current.style.display;
      reportRef.current.style.display = 'block';
      const originalPosition = reportRef.current.style.position;
      reportRef.current.style.position = 'relative'; // Ensure it's in the normal flow
      
      // Force white background for printing
      const originalBg = reportRef.current.style.background;
      const originalColor = reportRef.current.style.color;
      reportRef.current.style.background = 'white';
      reportRef.current.style.color = 'black';
      
      console.log("Capturing report with dimensions:", {
        width: reportRef.current.offsetWidth,
        height: reportRef.current.scrollHeight
      });

      // Get PNG of content with improved options
      const dataUrl = await toPng(reportRef.current, { 
        quality: 0.95, 
        width: reportRef.current.offsetWidth || 1200, 
        height: reportRef.current.scrollHeight,
        pixelRatio: 2,
        cacheBust: true, // Avoid cache issues
        skipAutoScale: false,
        style: {
          margin: '10mm',
          padding: '10mm',
          backgroundColor: 'white',
          color: 'black'
        },
        onclone: (clonedDoc) => {
          // Additional manipulation of the cloned document if needed
          const clonedElement = clonedDoc.getElementById(reportRef.current.id);
          if (clonedElement) {
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.overflow = 'visible';
          }
        }
      });
      
      console.log("Image captured successfully");
      
      // Reset styles
      reportRef.current.style.display = originalDisplay;
      reportRef.current.style.position = originalPosition;
      reportRef.current.style.background = originalBg;
      reportRef.current.style.color = originalColor;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate ratio to maintain aspect ratio
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Add image to PDF
      let position = 0;
      let heightLeft = pdfHeight;
      
      // First page
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      
      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      // Download PDF
      pdf.save(`${fileName}.pdf`);
      console.log("PDF generated and download initiated");
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setExportError(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Export data as CSV
  const exportCSV = () => {
    if (!healthData || selectedMetrics.length === 0) {
      alert('No data to export');
      return;
    }
    
    try {
      // For each selected metric, create a CSV
      selectedMetrics.forEach(metricType => {
        const metricData = healthData[metricType];
        if (!metricData || metricData.length === 0) return;
        
        let csvData = [];
        
        // Format data based on metric type
        if (metricType === 'bloodPressure') {
          // Blood pressure has separate systolic/diastolic values
          csvData = metricData.map(item => ({
            Date: new Date(item.date).toLocaleDateString(),
            Systolic: item.systolic,
            Diastolic: item.diastolic,
            Notes: item.notes || ''
          }));
        } else {
          // Other metrics have a standard value
          const valueKey = metricType === 'sleep' ? 'hours' : 'value';
          csvData = metricData.map(item => ({
            Date: new Date(item.date).toLocaleDateString(),
            Value: item[valueKey],
            Notes: item.notes || ''
          }));
        }
        
        // Convert to CSV string
        const csv = Papa.unparse(csvData);
        
        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${metricType}-data.csv`);
      });
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting data. Please try again.');
    }
  };
  
  return (
    <div className="space-y-2">
      <div className={`flex flex-wrap gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <button
          onClick={generatePDF}
          disabled={isExporting}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
            darkMode 
              ? 'bg-gradient-to-r from-violet-700 to-indigo-800 hover:from-violet-800 hover:to-indigo-900 text-white' 
              : 'bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white'
          } ${isExporting ? 'opacity-70 cursor-not-allowed' : ''} transition-all shadow-sm`}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9h4m-4 4h4m-4 4h4" />
              </svg>
              Download as PDF
            </>
          )}
        </button>
        
        <button
          onClick={exportCSV}
          disabled={isExporting}
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
            darkMode 
              ? 'bg-gradient-to-r from-green-700 to-emerald-800 hover:from-green-800 hover:to-emerald-900 text-white' 
              : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white'
          } ${isExporting ? 'opacity-70 cursor-not-allowed' : ''} transition-all shadow-sm`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV Data
        </button>
      </div>
      
      {exportError && (
        <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-md border border-red-200">
          {exportError}
        </div>
      )}
    </div>
  );
};

export default ReportExport;