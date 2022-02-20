export const tipoArchivo = function (extension: string): string {
  if (extension === 'ods') {
    return 'application/vnd.oasis.opendocument.spreadsheet';
  }
  if (extension === 'odt') {
    return 'application/vnd.oasis.opendocument.text';
  }
  if (extension === 'odp') {
    return 'application/vnd.oasis.opendocument.presentation';
  }
  if (extension === 'pdf') {
    return 'application/pdf';
  }
  if (extension === 'csv') {
    return 'text/csv';
  }
  if (extension === 'xlsx') {
    return 'application/vnd.ms-excel';
  }
  if (extension === 'jpg') {
    return 'image/jpeg';
  }
};
