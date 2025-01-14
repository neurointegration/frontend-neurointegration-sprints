import {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';
import { ROOT_API_URL } from '../../../config';
import { APIRoutes } from '../handles';
import axios from 'axios';

export type AuthResponseType = {
    isSucceed: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
    };
};

export type AuthWithoutStatusType = Omit<AuthResponseType, 'isSucceed'>;

type TelegramAuthDataType = {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    photoUrl: string;
    authDate: string;
    hash: string;
};

export const LoginByTelegram = (data: TelegramAuthDataType) => {
    return axios
        .post<AuthResponseType>(
            ROOT_API_URL + APIRoutes.User.ExternalTelegramLogin,
            { ...data }
        )
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const RefreshToken = (): Promise<AuthResponseType> => {
    return axios
        .post<AuthResponseType>(ROOT_API_URL + APIRoutes.User.RefreshToken, {
            accessToken: localStorage.getItem('accessToken'),
            refreshToken: localStorage.getItem('refreshToken'),
        })
        .then((response) => ({
            isSucceed: true,
            data: {
                accessToken: response.data['accessToken'],
                refreshToken: response.data['refreshToken'],
            },
        }))
        .catch(() => ({
            isSucceed: false,
            data: {
                accessToken: '',
                refreshToken: '',
            },
        }));
};

export const Logout = () => {
    return axios
        .post(ROOT_API_URL + APIRoutes.User.Logout)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const TestLogin = (data: { email: string; password: string }) => {
    return axios
        .post<AuthResponseType>(ROOT_API_URL + APIRoutes.User.Login, data)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
