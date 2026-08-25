import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatRelativeTime,
  formatTimeLeft,
  formatPhone,
} from "./formatters";

describe("formatCurrency", () => {
  it("formats zero pesewas", () => {
    expect(formatCurrency(0)).toBe("₵0.00");
  });

  it("converts pesewas to GHS correctly", () => {
    expect(formatCurrency(100)).toBe("₵1.00");
    expect(formatCurrency(350)).toBe("₵3.50");
    expect(formatCurrency(10000)).toBe("₵100.00");
  });

  it("formats fractional values", () => {
    expect(formatCurrency(1)).toBe("₵0.01");
    expect(formatCurrency(50)).toBe("₵0.50");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string to day and short month", () => {
    const result = formatDate("2024-01-15T00:00:00Z");
    expect(result).toMatch(/15 Jan/);
  });

  it("formats another date correctly", () => {
    const result = formatDate("2024-06-30T12:00:00Z");
    expect(result).toMatch(/30 Jun/);
  });
});

describe("formatDistance", () => {
  it("formats sub-kilometer distances in meters", () => {
    expect(formatDistance(0.5)).toBe("500m");
    expect(formatDistance(0.1)).toBe("100m");
    expect(formatDistance("0.25")).toBe("250m");
  });

  it("formats kilometer distances with one decimal", () => {
    expect(formatDistance(1)).toBe("1.0km");
    expect(formatDistance(2.5)).toBe("2.5km");
    expect(formatDistance("3.7")).toBe("3.7km");
  });
});

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "just now" for very recent timestamps', () => {
    const now = new Date("2024-06-01T12:00:00Z");
    vi.setSystemTime(now);
    const result = formatRelativeTime(new Date("2024-06-01T11:59:30Z"));
    expect(result).toBe("just now");
  });

  it("returns minutes ago for timestamps within an hour", () => {
    const now = new Date("2024-06-01T12:00:00Z");
    vi.setSystemTime(now);
    const result = formatRelativeTime(new Date("2024-06-01T11:45:00Z"));
    expect(result).toBe("15m ago");
  });

  it("returns hours ago for timestamps within a day", () => {
    const now = new Date("2024-06-01T12:00:00Z");
    vi.setSystemTime(now);
    const result = formatRelativeTime(new Date("2024-06-01T09:00:00Z"));
    expect(result).toBe("3h ago");
  });

  it("returns days ago for older timestamps", () => {
    const now = new Date("2024-06-05T12:00:00Z");
    vi.setSystemTime(now);
    const result = formatRelativeTime(new Date("2024-06-03T12:00:00Z"));
    expect(result).toBe("2d ago");
  });
});

describe("formatTimeLeft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "expired" for past timestamps', () => {
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    expect(formatTimeLeft("2024-06-01T11:00:00Z")).toBe("expired");
  });

  it("returns minutes left for timestamps within an hour", () => {
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    expect(formatTimeLeft("2024-06-01T12:30:00Z")).toBe("30m left");
  });

  it("returns hours and minutes for longer durations", () => {
    vi.setSystemTime(new Date("2024-06-01T12:00:00Z"));
    expect(formatTimeLeft("2024-06-01T14:30:00Z")).toBe("2h 30m left");
  });
});

describe("formatPhone", () => {
  it("converts leading-zero Ghanaian numbers to E.164", () => {
    expect(formatPhone("0241234567")).toBe("+233241234567");
  });

  it("passes through already-prefixed numbers", () => {
    expect(formatPhone("233241234567")).toBe("+233241234567");
  });

  it("handles numbers without prefix or leading zero", () => {
    expect(formatPhone("241234567")).toBe("+233241234567");
  });

  it("strips non-digit characters first", () => {
    expect(formatPhone("+233 24 123 4567")).toBe("+233241234567");
  });
});
