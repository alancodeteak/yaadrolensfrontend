import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Eye, FileImage, Upload, X } from 'lucide-react';
import { useLazyGetEmployeeDocumentViewUrlQuery } from '../../../../store/api/employeeApi';
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_MAX_BYTES,
  DOCUMENT_SIDES,
  DOCUMENT_TYPE_OPTIONS,
  documentTypeLabel,
  sideLabel,
} from '../../../../utils/employeeDocumentConstants';
import { hasStoredSide } from '../../../../utils/applyEmployeeDocumentChanges';
import { dashboardToast } from '../../../common';

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-500';
const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const DocumentSideSlot = ({
  side,
  employeeId,
  identityDocument,
  documentState,
  onUpload,
  onDelete,
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fetchViewUrl, { isFetching }] = useLazyGetEmployeeDocumentViewUrlQuery();

  const hasSide = hasStoredSide(side, identityDocument, documentState);
  const pendingFile = documentState.uploads?.[side];

  useEffect(() => {
    if (!pendingFile) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(pendingFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  const statusText = (() => {
    if (documentState.deletes?.[side]) return 'Will be removed on save';
    if (pendingFile) return 'New file selected';
    if (hasSide) return 'Uploaded';
    return 'Not uploaded';
  })();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!DOCUMENT_ACCEPT.split(',').includes(file.type)) {
      dashboardToast.error('Use a JPEG, PNG, or WebP image.', 'Invalid document');
      return;
    }
    if (file.size > DOCUMENT_MAX_BYTES) {
      dashboardToast.error('Image must be 5 MB or smaller.', 'File too large');
      return;
    }
    if (documentState.docType === 'other' && !documentState.otherLabel?.trim()) {
      dashboardToast.error('Enter a document name when type is Other.', 'Name required');
      return;
    }

    onUpload(side, file);
  };

  const handleView = async () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!employeeId || !hasSide) return;

    try {
      const result = await fetchViewUrl({ id: employeeId, side }).unwrap();
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      const detail = err?.data?.detail;
      if (err?.status === 503) {
        dashboardToast.error(
          detail || 'Document storage is not configured on the server.',
          'Storage unavailable'
        );
      } else {
        dashboardToast.error(detail || 'Could not open document.', 'View failed');
      }
    }
  };

  return (
    <div className="rounded-lg border border-gray-200/60 bg-white px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-900">{sideLabel(side)}</p>
          <p className="mt-0.5 text-[11px] text-gray-500">{statusText}</p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          {hasSide && !documentState.deletes?.[side] && (
            <button
              type="button"
              onClick={handleView}
              disabled={isFetching}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200/60 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200/60 px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
          >
            <Upload className="h-3.5 w-3.5" />
            {hasSide && !documentState.deletes?.[side] ? 'Replace' : 'Upload'}
          </button>
          {hasSide && !documentState.deletes?.[side] && (
            <button
              type="button"
              onClick={() => onDelete(side)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-[#FF3B30] hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          )}
        </div>
      </div>
      {previewUrl && (
        <img
          src={previewUrl}
          alt={`${side} preview`}
          className="mt-2 h-16 w-auto max-w-full rounded border border-gray-100 object-contain"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept={DOCUMENT_ACCEPT}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

const EmployeeDocumentsField = ({
  employeeId,
  identityDocument,
  documentState,
  onDocumentStateChange,
  className,
}) => {
  const handleUpload = (side, file) => {
    onDocumentStateChange((prev) => ({
      ...prev,
      uploads: { ...prev.uploads, [side]: file },
      deletes: { ...prev.deletes, [side]: false },
    }));
  };

  const handleDelete = (side) => {
    onDocumentStateChange((prev) => ({
      ...prev,
      uploads: { ...prev.uploads, [side]: null },
      deletes: { ...prev.deletes, [side]: true },
    }));
  };

  return (
    <div className={clsx('space-y-4', className)} data-tour="employee-documents">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
          <FileImage className="h-4 w-4" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Identity document</p>
          <p className="mt-0.5 text-[11px] text-gray-500">
            Optional · upload front and/or back (at least one if adding a document) · max 5 MB each
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200/60 bg-gray-50/40 p-4">
        <div>
          <label htmlFor="document-type" className={labelClass}>
            Document type
          </label>
          <select
            id="document-type"
            value={documentState.docType}
            onChange={(e) =>
              onDocumentStateChange((prev) => ({
                ...prev,
                docType: e.target.value,
                otherLabel: e.target.value === 'other' ? prev.otherLabel : '',
              }))
            }
            className={inputClass}
          >
            {DOCUMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {documentState.docType === 'other' && (
          <div>
            <label htmlFor="document-other-label" className={labelClass}>
              Document name *
            </label>
            <input
              id="document-other-label"
              type="text"
              value={documentState.otherLabel}
              onChange={(e) =>
                onDocumentStateChange((prev) => ({ ...prev, otherLabel: e.target.value }))
              }
              placeholder="e.g. Voter ID"
              className={inputClass}
            />
          </div>
        )}

        <p className="text-[11px] font-medium text-gray-600">
          {documentTypeLabel(documentState.docType || identityDocument?.type)}
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DOCUMENT_SIDES.map((side) => (
            <DocumentSideSlot
              key={side}
              side={side}
              employeeId={employeeId}
              identityDocument={identityDocument}
              documentState={documentState}
              onUpload={handleUpload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocumentsField;
