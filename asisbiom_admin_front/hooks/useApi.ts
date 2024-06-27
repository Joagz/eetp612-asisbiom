import axios from "axios";

interface ApiReq<T> {
    url: string,
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: T | null
}

export function useApi<T>({ url, method = "GET", body = null }: ApiReq<T>) {

    switch (method) {

        case "GET":
            return axios.get<T>(url, {
                method: method, headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
        case "POST":
            return axios.post(url, { body },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            )
        case "PUT":
            return axios.put(url, { body },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    }
                }
            )
        case "DELETE":
            return axios.delete(url, {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            }
            )
    }
}


