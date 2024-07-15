import axios, { AxiosResponse } from "axios";
import { getCookie } from "cookies-next";

interface ApiReq<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: T | null;
}

export function useApi<T>({
  url,
  method = "GET",
  body = null,
}: ApiReq<T>): Promise<AxiosResponse<T, any>> {
  if (process.env.NEXT_PUBLIC_JWT_COOKIE) {
    const cookie = getCookie(process.env.NEXT_PUBLIC_JWT_COOKIE);
    if (cookie)
      switch (method) {
        case "GET":
          return axios.get<T>(url, {
            method: method,
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: cookie,
            },
          });
        case "POST":
          return axios.post<T>(url, body, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: cookie,
            },
          });
        case "PUT":
          return axios.put<T>(url, body, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: cookie,
            },
          });
        case "DELETE":
          return axios.delete<T>(url, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: cookie,
            },
          });
      }
  }
  switch (method) {
    case "GET":
      return axios.get<T>(url, {
        method: method,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    case "POST":
      return axios.post<T>(url, body, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    case "PUT":
      return axios.put<T>(url, body, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    case "DELETE":
      return axios.delete<T>(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
  }
}
