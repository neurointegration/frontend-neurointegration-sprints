import { MainSectionType } from '../../../Platform/_types/Statuses';
import { path } from '../../routing/routes';
import { APIRoutes } from '../handles';
import http, {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';
import { TaskOrProjectTimeDescriptorType } from './projects';

export type TaskResponse = {
    id: string;
    title: string;
    sectionName: MainSectionType;
    planningTimes: TaskOrProjectTimeDescriptorType;
    factTimes: TaskOrProjectTimeDescriptorType;
};

export type TaskRequest = {
    title: string;
    projectId: string;
    sectionName: MainSectionType;
    planningTimes?: TaskOrProjectTimeDescriptorType;
    factTimes?: TaskOrProjectTimeDescriptorType;
};

export type PutTaskRequest = {
    id: string;
    title?: string;
    sectionName?: MainSectionType;
    planningTimes?: TaskOrProjectTimeDescriptorType;
    factTimes?: TaskOrProjectTimeDescriptorType;
};

export const GetAllProjectTasks = (projectId: string) => {
    const url = path(APIRoutes.Tasks.TasksProject, { projectId });

    return http
        .get<TaskResponse[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const PostTask = (taskData: TaskRequest) => {
    return http
        .post(APIRoutes.Tasks.Tasks, { ...taskData })
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const PutTask = (taskData: PutTaskRequest) => {
    return http
        .put(APIRoutes.Tasks.Tasks, { ...taskData })
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const DeleteTask = (taskId: string) => {
    const url = path(APIRoutes.Tasks.Task, {
        taskId,
    });
    return http
        .delete(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
