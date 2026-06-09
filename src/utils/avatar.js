const AVATAR_BASE = '/assets/avathars';

const AVATAR_FILES = [
  'Rectangle 2.png',
  'Rectangle 2-1.png',
  'Rectangle 2-2.png',
  'Rectangle 2-3.png',
  'Rectangle 2-4.png',
  'Rectangle 2-5.png',
  'Rectangle 2-6.png',
  'Rectangle 2-7.png',
  'Rectangle 2-8.png',
  'Rectangle 2-9.png',
  'Rectangle 2-10.png',
  'Rectangle 2-11.png',
  'Rectangle 2-12.png',
  'Rectangle 2-13.png',
  'Rectangle 2-14.png',
  'Rectangle 2-15.png',
  'Rectangle 2-16.png',
  'Rectangle 2-17.png',
  'Select Avatar=Avatar 8.png',
  'Select Avatar=Avatar 9.png',
  'Select Avatar=Avatar 10.png',
  'Select Avatar=Avatar 11.png',
  'Select Avatar=Avatar 14.png',
  'Select Avatar=Avatar 15.png',
  'Select Avatar=Avatar 16.png',
  'Select Avatar=Avatar 17.png',
  'Select Avatar=Avatar 20.png',
  'Select Avatar=Avatar 21.png',
  'Select Avatar=Avatar 22.png',
  'Select Avatar=Avatar 23.png',
];

const DEFAULT_AVATARS = AVATAR_FILES.map(
  (file) => `${AVATAR_BASE}/${encodeURIComponent(file)}`
);

function hashSeed(seed) {
  const value = String(seed ?? '');
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getDefaultAvatar(seed = 'user') {
  const index = hashSeed(seed) % DEFAULT_AVATARS.length;
  return DEFAULT_AVATARS[index];
}

export function resolveAvatar(src, seed) {
  if (typeof src === 'string' && src.trim()) {
    return src.trim();
  }
  return getDefaultAvatar(seed);
}

export { DEFAULT_AVATARS };
