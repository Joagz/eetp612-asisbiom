import axios from "axios";

interface ApiReq {
    url: string,
    method?: "GET" | "POST" | "PUT" | "DELETE"
}

export function useApi<T>({ url, method = "GET" }: ApiReq) {
    const response = axios.get<T>(url, {
        method: method, headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });

    return response;
}


