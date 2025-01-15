
import { path } from '../../routing/routes';
import { APIRoutes } from '../handles';
import http, {
    handleHttpResponse,
    handleHttpError,
} from '../utils/httpHandlers';

type DatesResponseType = {
    begin: string;
    end: string;
};

export type PossibleDatesResponseKeysType = '1' | '2' | '3' | '4';

export type SprintResponseType = {
    id: string;
    weeksCount: number;
    beginDate: string;
    endDate: string;
    weeks: {
        [key in keyof PossibleDatesResponseKeysType]?: DatesResponseType;
    };
};

export const GetAllSprints = () => {
    return http
        .get<SprintResponseType[]>(APIRoutes.Sprints.Sprints)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetSprint = (id: string) => {
    const url = path(APIRoutes.Sprints.Sprint, { sprintId: id });
    return http
        .get<SprintResponseType>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
