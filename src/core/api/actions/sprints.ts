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

type PartialKeys<K extends string, T> = Partial<Record<K, T>>;

export type SprintResponseType = {
    number: string;
    weeksCount: number;
    beginDate: string;
    endDate: string;
    weeks: PartialKeys<PossibleDatesResponseKeysType, DatesResponseType>;
};

export const GetAllSprints = () => {
    return http
        .get<SprintResponseType[]>(APIRoutes.Sprints.Sprints)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetSprint = (number: string) => {
    const url = path(APIRoutes.Sprints.Sprint, { number });
    return http
        .get<SprintResponseType>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
