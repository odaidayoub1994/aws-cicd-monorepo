import type { IValue, CreateValueDto, UpdateValueDto } from '@aws-cicd-monorepo/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(response.status, error.message ?? 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  values: {
    getAll: (): Promise<IValue[]> => fetchApi<IValue[]>('/values'),

    getById: (id: number): Promise<IValue> => fetchApi<IValue>(`/values/${id}`),

    create: (data: CreateValueDto): Promise<IValue> =>
      fetchApi<IValue>('/values', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: UpdateValueDto): Promise<IValue> =>
      fetchApi<IValue>(`/values/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: number): Promise<void> =>
      fetchApi<void>(`/values/${id}`, {
        method: 'DELETE',
      }),
  },

  health: {
    check: (): Promise<{ status: string; timestamp: string }> =>
      fetchApi<{ status: string; timestamp: string }>('/health'),
  },
};

export { ApiError };
