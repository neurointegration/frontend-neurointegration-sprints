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

export type MePutRequestType = {
    firstName?: string;
    lastName?: string;
    aboutMe?: string;
    isOnboardingComplete?: boolean;
    sprintWeeksCount?: number;
};

export const GetMyRoles = () => {
    return http
        .get<string[]>(APIRoutes.Me.Roles)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const SetMyRoles = (isTrainer: boolean) => {
    return http
        .post(APIRoutes.Me.Roles, {
            roleOption: isTrainer ? 'TrainerAndClient' : 'ClientOnly',
        })
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetMyInformation = () => {
    return http
        .get<MeResponseType>(APIRoutes.Me.Me)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const PutMyInformation = (data?: MePutRequestType) => {
    return http
        .put(APIRoutes.Me.Me, { ...data })
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

type TrainerResponseType = {
    trainerUsername: string;
};

export const GetMyTrainer = () => {
    return http
        .get<{ username: string }>(APIRoutes.Me.Trainer)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const PostMyTrainer = (data: TrainerResponseType) => {
    return http
        .post<TrainerResponseType>(APIRoutes.Me.Trainer, { ...data })
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
