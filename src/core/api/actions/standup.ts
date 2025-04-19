import { path } from '../../routing/routes';
import { APIRoutes } from '../handles';
import http, {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';



export type StandupResponseType = {
    id: string;
    title: string;
};


export const GetSprintStandup = (sprintId: string) => {
    const url = path(APIRoutes.Standup.StandupSprint, {
        sprintId,
    });
    return http
        .get<StandupResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetAllStandups = () => {
    const url = path(APIRoutes.Standup.Standups);
    return http
        .get<StandupResponseType>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
