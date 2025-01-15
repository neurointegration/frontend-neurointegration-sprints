import { TimeStatusType } from '../../../Platform/_times/TimeComparer';
import { MainSectionType } from '../../../Platform/_types/Statuses';
import { path } from '../../routing/routes';
import { APIRoutes } from '../handles';
import http, {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';
import { PossibleDatesResponseKeysType } from './sprints';

export type TimeType = {
    hours: number;
    minutes: number;
    status?: TimeStatusType;
};

export type TaskOrProjectTimeDescriptorType =
    | null
    | {
          [key in keyof PossibleTimeResponceKeysType]?: TimeType;
      };

export type PossibleTimeResponceKeysType =
    | PossibleDatesResponseKeysType
    | 'total';

type ProjectResponseType = {
    id: string;
    title: string;
    sectionName: MainSectionType;
    planningTimes: TaskOrProjectTimeDescriptorType;
    factTimes: TaskOrProjectTimeDescriptorType;
};

export const GetAllSprintProjects = (sprintId: string) => {
    const url = path(APIRoutes.Projects.ProjectsSprint, {
        sprintId,
    });
    return http
        .get<ProjectResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetProject = (projectId: string) => {
    const url = path(APIRoutes.Projects.Project, {
        projectId,
    });
    return http
        .get<ProjectResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
