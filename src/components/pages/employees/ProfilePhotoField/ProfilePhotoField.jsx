import { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { Camera, X } from 'lucide-react';
import { UserAvatar } from '../../../common';

const ACCEPT = 'image/jpeg,image/png,image/webp';
const MAX_BYTES = 2 * 1024 * 1024;

const ProfilePhotoField = ({
  name = '',
  seed,
  currentPhotoUrl,
  photoFile,
  removePhoto = false,
  onPhotoFileChange,
  onRemovePhotoChange,
  className,
}) => {
  const inputRef = useRef(null);
  const previewUrl = useMemo(() => {
    if (photoFile) return URL.createObjectURL(photoFile);
    return null;
  }, [photoFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displaySrc = removePhoto ? null : previewUrl || currentPhotoUrl || null;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPT.split(',').includes(file.type)) {
      event.target.value = '';
      onPhotoFileChange?.(null, 'Use a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      event.target.value = '';
      onPhotoFileChange?.(null, 'Image must be 2 MB or smaller.');
      return;
    }

    onRemovePhotoChange?.(false);
    onPhotoFileChange?.(file, null);
    event.target.value = '';
  };

  const handleRemove = () => {
    onPhotoFileChange?.(null, null);
    onRemovePhotoChange?.(true);
  };

  return (
    <div className={clsx('flex items-center gap-4', className)}>
      <div className="relative shrink-0">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={name ? `${name} profile` : 'Profile preview'}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-gray-100"
          />
        ) : (
          <UserAvatar
            className="h-20 w-20 rounded-full ring-2 ring-gray-100"
            name={name || 'Employee'}
            seed={seed}
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200/60 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-[#007AFF]"
          aria-label="Upload profile photo"
        >
          <Camera className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">Profile photo</p>
        <p className="mt-0.5 text-[11px] text-gray-500">JPEG, PNG, or WebP · max 2 MB</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-gray-200/60 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Upload photo
          </button>
          {(displaySrc || photoFile || (currentPhotoUrl && !removePhoto)) && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[#FF3B30] transition-colors hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfilePhotoField;
