const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function fetchAPI(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Une erreur est survenue')
  }

  return res.json()
}

export const api = {
  get: (path: string) => fetchAPI(path),
  
  post: (path: string, data: any) => 
    fetchAPI(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: (path: string, data: any) =>
    fetchAPI(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (path: string) =>
    fetchAPI(path, {
      method: 'DELETE',
    }),
}