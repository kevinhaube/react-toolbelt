import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

import { EndpointConfig } from "../../api";

interface EndpointResponse<T> {
    loading: boolean;
    data?: T;
    status: number;
    message: string;
}

function useEndpoint<T>(endpoint: EndpointConfig<T>): EndpointResponse<T> {
    const [response, setResponse] = useState<EndpointResponse<T>>({
        loading: true,
        data: undefined,
        status: 0,
        message: "",
    });

    const handleResponse = (res: AxiosResponse) => {
        setResponse({
            loading: false,
            data: res.data || null,
            status: res.status,
            message: "",
        });
    };

    const handleError = (err: any) => {
        setResponse({
            loading: false,
            data: undefined,
            status: err.response?.status || 400,
            message: err.message,
        });
    };

    useEffect(() => {
        const ifSubscribed = (action: (v: any) => void, param: any) => {
            if (isSubscribed) {
                action(param);
            }
        };
        let isSubscribed = true;
        switch (endpoint.method) {
            case "GET": {
                axios
                    .get<T>(endpoint.url, endpoint)
                    .then((res: AxiosResponse) => {
                        ifSubscribed(handleResponse, res);
                    })
                    .catch((err: any) => {
                        ifSubscribed(handleError, err);
                    });
                break;
            }
            case "POST": {
                axios
                    .post<T>(endpoint.url, endpoint)
                    .then((res: AxiosResponse) => {
                        ifSubscribed(handleResponse, res);
                    })
                    .catch((err: any) => {
                        ifSubscribed(handleError, err);
                    });
                break;
            }
            case "PATCH": {
                axios
                    .patch<T>(endpoint.url, endpoint)
                    .then((res: AxiosResponse) => {
                        ifSubscribed(handleResponse, res);
                    })
                    .catch((err: any) => {
                        ifSubscribed(handleError, err);
                    });
                break;
            }
            case "DELETE": {
                axios
                    .delete<T>(endpoint.url, endpoint)
                    .then((res: AxiosResponse) => {
                        ifSubscribed(handleResponse, res);
                    })
                    .catch((err: any) => {
                        ifSubscribed(handleError, err);
                    });
                break;
            }
        }
        return () => {
            isSubscribed = false;
        };
    }, [endpoint]);

    return response;
}

export default useEndpoint;
