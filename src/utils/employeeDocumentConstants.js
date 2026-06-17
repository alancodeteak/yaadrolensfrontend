export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'aadhaar', label: 'Aadhaar' },
  { value: 'pan', label: 'PAN card' },
  { value: 'driving_license', label: 'Driving license' },
  { value: 'other', label: 'Other' },
];

export const DOCUMENT_SIDES = ['front', 'back'];

export const DOCUMENT_ACCEPT = 'image/jpeg,image/png,image/webp';
export const DOCUMENT_MAX_BYTES = 5 * 1024 * 1024;

export const EMPTY_DOCUMENT_STATE = {
  docType: 'aadhaar',
  otherLabel: '',
  uploads: { front: null, back: null },
  deletes: { front: false, back: false },
};

export const DEFAULT_IDENTITY_DOCUMENT = {
  type: null,
  label: null,
  has_front: false,
  has_back: false,
};

export function documentTypeLabel(type) {
  return DOCUMENT_TYPE_OPTIONS.find((o) => o.value === type)?.label || type || 'Document';
}

export function sideLabel(side) {
  return side === 'front' ? 'Front' : 'Back';
}

export function hasDocumentChanges(state) {
  if (!state) return false;
  const hasUpload = DOCUMENT_SIDES.some((side) => state.uploads?.[side]);
  const hasDelete = DOCUMENT_SIDES.some((side) => state.deletes?.[side]);
  return hasUpload || hasDelete;
}
