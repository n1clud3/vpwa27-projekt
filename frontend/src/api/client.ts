const BASE_URL = 'http://localhost:3333/api/v1';
export const TOKEN_KEY = 'hejju_token';

export class ApiError extends Error {
  status: number;
  messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages.join(', '));
    this.status = status;
    this.messages = messages;
  }
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const init: RequestInit = {
    method: options.method ?? 'GET',
    headers,
  };

  if (options.body !== undefined) init.body = JSON.stringify(options.body);

  const response = await fetch(`${BASE_URL}${path}`, init);

  const json = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const errors = (json as { errors?: { message: string }[] } | null)?.errors;
    throw new ApiError(response.status, errors?.map((e) => e.message) ?? ['Request failed']);
  }

  return json as T;
}

/** Turns any thrown error into text for a notification. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.messages.join('\n');
  return 'Cannot reach the server. Is the backend running?';
}
