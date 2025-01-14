import { APIRoutes } from '../handles';
import http, {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';

export type MeResponseType = {
    id: string;
    firstName: string;
    lastName: string;
    aboutMe: string;
    photoUrl: string;
    isOnboardingComplete: boolean;
    sprintWeeksCount: number;
};

export const GetMyRoles = () => {
    return http
        .get<string[]>(APIRoutes.Me.Roles)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetMyInformation = () => {
    return http
        .get<MeResponseType>(APIRoutes.Me.Me)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
