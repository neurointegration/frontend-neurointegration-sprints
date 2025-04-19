import { path } from '../../routing/routes';
import { APIRoutes } from '../handles';
import http, {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';



export type ReflectionResponseType = {
    id: string;
    title: string;
};


export const GetSprintReflection = (sprintId: string) => {
    const url = path(APIRoutes.Reflection.ReflectionSprint, {
        sprintId,
    });
    return http
        .get<ReflectionResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetAllReflections = () => {
    const url = path(APIRoutes.Reflection.Reflections);
    return http
        .get<ReflectionResponseType>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
