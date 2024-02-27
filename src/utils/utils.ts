// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
}

export function capitalize(str: string | null): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function stringToByteArray(input: string): Uint8Array {
  const utf8Encoder = new TextEncoder();
  return utf8Encoder.encode(input);
}

export function isEqual(value1: string | null, value2: string) {
  return value1 === value2;
}
