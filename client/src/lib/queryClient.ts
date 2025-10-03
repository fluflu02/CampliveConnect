import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let url = "";
    const lastItem = queryKey[queryKey.length - 1];
    
    if (typeof lastItem === "object" && lastItem !== null && !Array.isArray(lastItem)) {
      const pathParts = queryKey.slice(0, -1);
      url = pathParts.join("/");
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(lastItem)) {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      }
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    } else {
      url = queryKey.join("/");
    }

    const res = await fetch(url, {
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
