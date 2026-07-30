/** Remove driver.js artifacts that can block clicks after navigation. */
export function clearDriverTourArtifacts() {
  document.body.classList.remove('driver-active');
  document.querySelector('.driver-overlay')?.remove();
  document.querySelector('.driver-popover')?.remove();
}
