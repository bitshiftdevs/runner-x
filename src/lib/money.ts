/**
 * Money helpers for the pesewas-based backend contract.
 *
 * The backend sends and receives every fee, balance, and transaction as an
 * integer number of pesewas (1 GHS = 100 pesewas). Never send decimals over
 * the wire; convert at the display boundary only.
 */

/** Fixed conversion — 1 GHS is 100 pesewas. */
export const PESEWAS_PER_GHS = 100;

/**
 * Formats a pesewa amount as a human-readable Ghanaian cedi string.
 *
 * @example formatPesewasAsGhs(2550)  // "GHS 25.50"
 * @example formatPesewasAsGhs(0)     // "GHS 0.00"
 */
export function formatPesewasAsGhs(pesewas: number): string {
  const ghs = pesewas / PESEWAS_PER_GHS;
  return `GHS ${ghs.toFixed(2)}`;
}

/** Convert an integer number of pesewas to a decimal cedi amount. */
export function pesewasToGhs(pesewas: number): number {
  return pesewas / PESEWAS_PER_GHS;
}

/**
 * Convert a decimal cedi amount to an integer number of pesewas.
 * Rounds to the nearest pesewa so downstream math stays lossless.
 */
export function ghsToPesewas(ghs: number): number {
  return Math.round(ghs * PESEWAS_PER_GHS);
}

/**
 * Fee constants sent to the backend when creating an errand. Kept together
 * with the formatters so the pesewas contract is discoverable in one place.
 */
export const BASE_FEE_PESEWAS = 300; // 3.00 GHS
export const DISTANCE_RATE_PESEWAS_PER_KM = 250; // 2.50 GHS per km
