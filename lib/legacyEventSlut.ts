import { validate as validateUUID } from "uuid";

export function isLegacyEventSlug(value): boolean {
  return !validateUUID(value);
}

export function getEventShortIdFromLegacyEventSlug(value): string | null {
  const parts = value.split("-");

  return parts[parts.length - 1] || null;
}
