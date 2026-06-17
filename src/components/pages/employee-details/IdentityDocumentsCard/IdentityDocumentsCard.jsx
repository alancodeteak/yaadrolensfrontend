import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, FileImage, Shield } from 'lucide-react';
import Card from '../../../common/Card/Card';
import { dashboardToast } from '../../../common';
import { useLazyGetEmployeeDocumentViewUrlQuery } from '../../../../store/api/employeeApi';
import {
  DOCUMENT_SIDES,
  documentTypeLabel,
  sideLabel,
} from '../../../../utils/employeeDocumentConstants';

const IdentityDocumentsCard = ({ employee }) => {
  const [fetchViewUrl] = useLazyGetEmployeeDocumentViewUrlQuery();
  const [loadingSide, setLoadingSide] = useState(null);
  const doc = employee?.identity_document || {};

  const hasAny = doc.has_front || doc.has_back;

  const handleView = async (side) => {
    setLoadingSide(side);
    try {
      const result = await fetchViewUrl({ id: employee.id, side }).unwrap();
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
    } finally {
      setLoadingSide(null);
    }
  };

  return (
    <Card className="lg:col-span-2">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5856D6]/10 text-[#5856D6]">
            <FileImage className="h-4 w-4" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Identity document</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Admin-only · viewed via secure short-lived links
            </p>
          </div>
        </div>
        <Link
          to="/admin/employees"
          className="shrink-0 text-xs font-medium text-[#007AFF] hover:underline"
        >
          Edit on Employees list
        </Link>
      </div>

      {!hasAny ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 px-3 py-4 text-sm text-gray-500">
          No identity document uploaded yet. Add front and/or back when creating or editing this
          employee.
        </p>
      ) : (
        <div className="rounded-xl border border-gray-200/60 bg-gray-50/30 px-3 py-3">
          <p className="text-xs font-semibold text-gray-800">
            {documentTypeLabel(doc.type)}
            {doc.type === 'other' && doc.label ? (
              <span className="ml-1 font-normal text-gray-500">({doc.label})</span>
            ) : null}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DOCUMENT_SIDES.map((side) => {
              if (!doc[`has_${side}`]) return null;
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => handleView(side)}
                  disabled={loadingSide === side}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200/60 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  <Eye className="h-3.5 w-3.5 text-[#007AFF]" />
                  View {sideLabel(side).toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2.5">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#007AFF]" strokeWidth={2} />
        <p className="text-[11px] leading-relaxed text-gray-600">
          Documents are stored in a private cloud bucket. View links expire after a short time and
          each view is logged. They are not available on kiosk devices.
        </p>
      </div>
    </Card>
  );
};

export default IdentityDocumentsCard;
