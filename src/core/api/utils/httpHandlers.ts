import axios, { AxiosError, AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { Resetter } from 'recoil';
import { ROOT_API_URL } from '../../../config';
import decodeToken from './tokenDecoder';
import { API } from '../handles';
import { AuthWithoutStatusType, Logout } from '../actions/auth';

export type HTTPSuccessResponse<T = undefined> = {
    isSuccess: true;
    body: T;
};

export type HTTPErrorResponse = {
    isSuccess: false;
    message: string;
    code: number | undefined;
};

const http = axios.create({
    baseURL: ROOT_API_URL,
    // withCredentials: true,
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        // 'Access-Control-Allow-Credentials': 'true',
    },
    // withCredentials: true,
});

let interceptorsApplied: boolean = false;

export const applyInterceptors = (
    authState: AuthWithoutStatusType,
    setAuthState: Dispatch<SetStateAction<AuthWithoutStatusType>>,
    resetState: Resetter
) => {
    if (interceptorsApplied) {
        return;
    }

    interceptorsApplied = true;
    let isRefreshing = false;

    let refreshRequest: Promise<AuthWithoutStatusType> = Promise.resolve({
        data: {
            accessToken: authState?.data?.accessToken,
            refreshToken: authState?.data?.refreshToken,
        },
    });

    
    const decodedTokenPayload = decodeToken(authState.data.accessToken);
    let tokenExpirationTime: Date;
    
    const ensureAuthorization = (): Promise<AuthWithoutStatusType> => {
        if (decodedTokenPayload) {
            tokenExpirationTime = new Date(decodedTokenPayload.exp * 1000);
        }

        const shouldRefreshToken = authState.data.accessToken === '' ||
        tokenExpirationTime < new Date();

        return shouldRefreshToken ? refreshToken() : Promise.resolve(authState);
    };
    
    
    const refreshToken = async (): Promise<AuthWithoutStatusType> => {
        if (isRefreshing) {
            return refreshRequest;
        }
        
        isRefreshing = true;   
        refreshRequest = API.AUTH.Refresh().then((data) => {
            if (!data.isSucceed && data?.messages?.token[0] === 'Refresh token expired') { 
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                location.reload();
            }
            return data
        }).finally(
            () => (isRefreshing = false)
        );
        
        return refreshRequest;
    };

    http.interceptors.request.use((config) => {
        return ensureAuthorization().then(({ data }) => {
            setAuthState((prevAuthState) => ({
                ...prevAuthState,
                data,
            }));

            config.headers.Authorization = `Bearer ${data.accessToken}`;
            return config;
        });
    });

        http.interceptors.response.use(
        (response) => response,
        (err) => {
            const shouldLogout = err.response && err.response.status === 401;

            if (shouldLogout) {
                resetState();
            }

            throw err;
        }
    );
    
};

export const handleHttpResponse = <T>(
    response: AxiosResponse<T>
): HTTPSuccessResponse<T> => {
    return {
        isSuccess: true,
        body: response.data,
    };
};

export const handleHttpError = (error: AxiosError): HTTPErrorResponse => {
    return {
        isSuccess: false,
        message: error?.message ?? '',
        code: error?.response?.status,
    };
};

export default http;
