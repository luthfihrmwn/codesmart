/**
 * Import/Export Utility for Excel and CSV
 * Uses SheetJS (xlsx) library
 */

class ImportExportService {
    /**
     * Export data to Excel file
     * @param {Array} data - Array of objects to export
     * @param {String} filename - Name of the file (without extension)
     * @param {String} sheetName - Name of the worksheet
     */
    exportToExcel(data, filename = 'export', sheetName = 'Sheet1') {
        // Load XLSX library dynamically
        if (typeof XLSX === 'undefined') {
            console.error('XLSX library not loaded');
            alert('Excel library not available. Please include XLSX library.');
            return;
        }

        try {
            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Convert JSON to worksheet
            const ws = XLSX.utils.json_to_sheet(data);

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, sheetName);

            // Write the file
            XLSX.writeFile(wb, `${filename}.xlsx`);

            return true;
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export to Excel: ' + error.message);
            return false;
        }
    }

    /**
     * Export data to CSV file
     * @param {Array} data - Array of objects to export
     * @param {String} filename - Name of the file (without extension)
     */
    exportToCSV(data, filename = 'export') {
        if (!data || data.length === 0) {
            alert('No data to export');
            return false;
        }

        try {
            // Get headers from first object
            const headers = Object.keys(data[0]);

            // Create CSV content
            let csv = headers.join(',') + '\n';

            // Add data rows
            data.forEach(row => {
                const values = headers.map(header => {
                    const value = row[header];
                    // Handle null/undefined
                    if (value === null || value === undefined) return '';
                    // Escape quotes and wrap in quotes if contains comma, quote, or newline
                    const strValue = String(value);
                    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
                        return '"' + strValue.replace(/"/g, '""') + '"';
                    }
                    return strValue;
                });
                csv += values.join(',') + '\n';
            });

            // Create blob and download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            alert('Failed to export to CSV: ' + error.message);
            return false;
        }
    }

    /**
     * Import data from Excel file
     * @param {File} file - File object from input
     * @param {Function} callback - Callback function with imported data
     */
    importFromExcel(file, callback) {
        if (typeof XLSX === 'undefined') {
            console.error('XLSX library not loaded');
            alert('Excel library not available. Please include XLSX library.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get first sheet
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                callback(null, jsonData);
            } catch (error) {
                console.error('Error importing Excel:', error);
                callback(error, null);
            }
        };

        reader.onerror = (error) => {
            callback(error, null);
        };

        reader.readAsArrayBuffer(file);
    }

    /**
     * Import data from CSV file
     * @param {File} file - File object from input
     * @param {Function} callback - Callback function with imported data
     */
    importFromCSV(file, callback) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');

                if (lines.length === 0) {
                    callback(new Error('Empty CSV file'), null);
                    return;
                }

                // Parse headers
                const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

                // Parse data rows
                const data = [];
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const values = this.parseCSVLine(line);
                    if (values.length !== headers.length) continue;

                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index];
                    });
                    data.push(row);
                }

                callback(null, data);
            } catch (error) {
                console.error('Error importing CSV:', error);
                callback(error, null);
            }
        };

        reader.onerror = (error) => {
            callback(error, null);
        };

        reader.readAsText(file);
    }

    /**
     * Parse CSV line handling quoted values
     * @param {String} line - CSV line to parse
     * @returns {Array} - Array of values
     */
    parseCSVLine(line) {
        const values = [];
        let currentValue = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    currentValue += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote mode
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of value
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }

        // Add last value
        values.push(currentValue.trim());

        return values;
    }

    /**
     * Show file import dialog
     * @param {String} accept - File types to accept (.csv, .xlsx, etc)
     * @param {Function} callback - Callback with file object
     */
    showImportDialog(accept, callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                callback(file);
            }
        };

        input.click();
    }
}

// Create global instance
const importExportService = new ImportExportService();
