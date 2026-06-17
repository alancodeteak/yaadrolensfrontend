/**
 * Trigger a browser download from a Blob and optional filename.
 * Parses filename from Content-Disposition when not provided.
 */
export function parseContentDispositionFilename(header) {
  if (!header) return null;
  const match = /filename="?([^";\n]+)"?/i.exec(header);
  return match ? match[1].trim() : null;
}

export function downloadBlob(blob, filename = 'download') {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}

export async function downloadFromResponse(response, fallbackFilename) {
  const blob = await response.blob();
  const fromHeader = parseContentDispositionFilename(
    response.headers.get('Content-Disposition')
  );
  downloadBlob(blob, fromHeader || fallbackFilename);
}
