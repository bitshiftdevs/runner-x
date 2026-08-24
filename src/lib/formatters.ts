export const PESEWAS_PER_GHS = 100;

export function formatCurrency(pesewas: number): string {
  const formatted = Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(pesewas / PESEWAS_PER_GHS);

  return formatted.replace("GH₵", "₵");
}
export function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDistance(km: number | string): string {
  const n = Number(km);
  return n < 1 ? `${Math.round(n * 1000)}m` : `${n.toFixed(1)}km`;
}

export function formatRelativeTime(date: string | Date): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatTimeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "expired";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m left`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m left`;
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.startsWith("233")) return `+${clean}`;
  if (clean.startsWith("0")) return `+233${clean.slice(1)}`;
  return `+233${clean}`;
}
