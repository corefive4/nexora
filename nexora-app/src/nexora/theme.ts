export const COLORS = {
  primary: "#3D82F6",
  accent: "#B8F52A",
  background: "#0D111A",
  secondary: "#111722",
  card: "#151B27",
} as const;

export function safeNumber(
  value: unknown,
  fallback = 0,
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function normalizeRate(
  value: unknown,
  fallback = 0,
): number {
  const rate = safeNumber(value, fallback);

  // Supports both decimal values such as 0.012
  // and percentage values such as 1.2.
  return rate > 0 && rate < 1 ? rate * 100 : rate;
}

export function money(
  value: unknown,
  currency = "USDT",
): string {
  const amount = safeNumber(value);

  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function formatRange(
  min: unknown,
  max?: unknown,
  currency = "USDT",
): string {
  const minimum = safeNumber(min);

  if (max === undefined || max === null || safeNumber(max) <= 0) {
    return `${money(minimum, currency)}+`;
  }

  return `${money(minimum, currency)} – ${money(max, currency)}`;
}

export function formatPercent(
  value: unknown,
  decimals = 2,
): string {
  const rate = normalizeRate(value);

  return `${rate.toFixed(decimals)}%`;
}

export function formatDate(
  value?: string | Date | null,
): string {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date
    ? value
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(
  value?: string | Date | null,
): string {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date
    ? value
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCountdown(
  value?: string | Date | null,
): string {
  if (!value) {
    return "—";
  }

  const target = value instanceof Date
    ? value.getTime()
    : new Date(value).getTime();

  if (!Number.isFinite(target)) {
    return "—";
  }

  const difference = target - Date.now();

  if (difference <= 0) {
    return "Completed";
  }

  const totalSeconds = Math.floor(
    difference / 1000,
  );

  const days = Math.floor(
    totalSeconds / 86400,
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function calculateProfit(
  amount: unknown,
  dailyRate: unknown,
  durationDays: unknown,
): number {
  const principal = safeNumber(amount);
  const rate = normalizeRate(dailyRate) / 100;
  const days = safeNumber(durationDays);

  return principal * rate * days;
}

export function calculateReturn(
  amount: unknown,
  dailyRate: unknown,
  durationDays: unknown,
): number {
  const principal = safeNumber(amount);

  return principal + calculateProfit(
    amount,
    dailyRate,
    durationDays,
  );
}

export function clamp(
  value: unknown,
  min: number,
  max: number,
): number {
  return Math.min(
    Math.max(safeNumber(value), min),
    max,
  );
}

export function truncateAddress(
  value?: string | null,
  start = 6,
  end = 4,
): string {
  if (!value) {
    return "—";
  }

  if (value.length <= start + end + 3) {
    return value;
  }

  return `${value.slice(0, start)}…${value.slice(-end)}`;
}
