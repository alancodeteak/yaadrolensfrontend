import { DOCUMENT_SIDES } from './employeeDocumentConstants';

/**
 * Apply pending identity document uploads or deletes after employee save.
 */
export async function applyEmployeeDocumentChanges(
  employeeId,
  documentState,
  mutations,
  identityDocument = null
) {
  const { uploadEmployeeDocument, deleteEmployeeDocument } = mutations;

  if (!documentState || !employeeId) return;

  const pendingUploads = DOCUMENT_SIDES.filter((side) => documentState.uploads?.[side]);
  if (pendingUploads.length === 0 && !DOCUMENT_SIDES.some((side) => documentState.deletes?.[side])) {
    return;
  }

  if (documentState.docType === 'other' && !documentState.otherLabel?.trim()) {
    if (pendingUploads.length > 0) {
      throw new Error('Document name is required when type is Other.');
    }
  }

  for (const side of DOCUMENT_SIDES) {
    if (documentState.deletes?.[side] && identityDocument?.[`has_${side}`]) {
      await deleteEmployeeDocument({ id: employeeId, side }).unwrap();
    }
  }

  for (const side of DOCUMENT_SIDES) {
    const file = documentState.uploads?.[side];
    if (!file) continue;
    await uploadEmployeeDocument({
      id: employeeId,
      side,
      file,
      docType: documentState.docType,
      label: documentState.docType === 'other' ? documentState.otherLabel : null,
    }).unwrap();
  }
}

export function hasStoredSide(side, identityDocument, documentState) {
  if (documentState?.deletes?.[side]) return false;
  if (documentState?.uploads?.[side]) return true;
  return Boolean(identityDocument?.[`has_${side}`]);
}

export function hasAnyStoredDocument(identityDocument, documentState) {
  return DOCUMENT_SIDES.some((side) => hasStoredSide(side, identityDocument, documentState));
}
