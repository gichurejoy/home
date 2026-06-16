/**
 * Utility to convert an array of JSON objects into a CSV file and download it.
 */
export function exportToCSV<T>(
  data: T[],
  headers: { key: keyof T; label: string }[],
  filenamePrefix = 'export'
) {
  if (!data || !data.length) {
    return false;
  }

  // Create header row
  const csvHeaders = headers.map(h => `"${String(h.label).replace(/"/g, '""')}"`).join(',');
  
  // Create data rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header.key];
      let formattedValue = '';
      
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          formattedValue = JSON.stringify(value);
        } else {
          formattedValue = String(value);
        }
      }
      
      // Escape quotes and wrap in quotes
      return `"${formattedValue.replace(/"/g, '""')}"`;
    }).join(',');
  });

  const csvContent = [csvHeaders, ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
}
