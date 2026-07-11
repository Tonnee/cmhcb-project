/**
 * Safely parse a JSON string, returning a fallback value if parsing fails
 * or if the input is null/undefined.
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("JSON parsing error for input:", jsonString, error);
    return fallback;
  }
}
