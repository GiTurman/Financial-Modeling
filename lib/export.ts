import * as XLSX from 'xlsx';

/**
 * Exports data to an XLSX file.
 * @param data - Array of objects to be exported.
 * @param fileName - Name of the file (without extension).
 * @param sheetName - Name of the worksheet.
 */
export const exportToXLSX = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
