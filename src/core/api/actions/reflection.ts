import { ReflectionAnswerTypeEnum } from '../../../Platform/_types/AnswerTypes';
import { path } from '../../routing/routes';
import { APIRoutes } from '../handles';
import http, {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';



export type ReflectionResponseType = {
    answerType: ReflectionAnswerTypeEnum;
    sprintReplyNumber: 0 | 1 | 2 | 3
    sprintNumber: number;
    date: string;
    answer: string;
};



export const GetSprintReflection = (sprintNumber: string) => {
    const url = path(APIRoutes.Reflection.ReflectionSprint, {
        sprintNumber,
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
