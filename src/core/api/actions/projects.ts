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

type PartialKeys<K extends string, T> = Partial<Record<K, T>>;

export type PossibleTimeResponceKeysType =
    | PossibleDatesResponseKeysType
    | 'total';

export type TaskOrProjectTimeDescriptorType = null | PartialKeys<
    PossibleTimeResponceKeysType,
    TimeType
>;

export type ProjectResponseType = {
    id: string;
    title: string;
    sectionName: MainSectionType;
    planningTimes: TaskOrProjectTimeDescriptorType;
    factTimes: TaskOrProjectTimeDescriptorType;
    createdAt: string;
};

export type ProjectRequestType = {
    title: string;
    sectionName: string;
    sprintNumber: string;
    planningTimes?: TaskOrProjectTimeDescriptorType;
    factTimes?: TaskOrProjectTimeDescriptorType;
};

export type PutProjectRequest = {
    id: string;
    title?: string;
    sectionName?: MainSectionType;
    planningTimes?: TaskOrProjectTimeDescriptorType;
    factTimes?: TaskOrProjectTimeDescriptorType;
};

export const GetAllSprintProjects = (sprintNumber: string) => {
    const url = path(APIRoutes.Projects.ProjectsSprint, {
        sprintNumber,
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
        .get<ProjectResponseType>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const PostProject = (projectData: ProjectRequestType) => {
    return http
        .post(APIRoutes.Projects.Projects, { ...projectData })
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const PutProject = (projectData: PutProjectRequest) => {
    return http
        .put(APIRoutes.Projects.Projects, { ...projectData })
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const DeleteProject = (projectId: string) => {
    const url = path(APIRoutes.Projects.Project, {
        projectId,
    });
    return http
        .delete(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
