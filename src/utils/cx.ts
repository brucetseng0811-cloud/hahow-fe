export type ClassValue = string | false | null | undefined

/** Joins truthy class names with a single space. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
