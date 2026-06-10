/** Human-friendly order reference, e.g. EB-260606-9F3A. */
export function genOrderCode(): string {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EB-${y}${m}${day}-${rnd}`;
}
