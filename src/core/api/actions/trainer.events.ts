import http, {
    handleHttpResponse,
    handleHttpError,
} from '../utils/httpHandlers';
import { ProjectResponseType } from './projects';
import { SprintResponseType } from './sprints';
import { path } from '../../routing/routes';
import { TaskResponse } from './tasks';
import { APIRoutes } from '../handles';

export const GetTrainerClientSprints = (userId: string) => {
    const url = path(APIRoutes.Trainer.Sprints.Sprints, { userId });
    return http
        .get<SprintResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetTrainerClientSprintProjects = (
    userId: string,
    sprintId: string
) => {
    const url = path(APIRoutes.Trainer.Projects.ProjectsSprint, {
        userId,
        sprintId,
    });
    return http
        .get<ProjectResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetTrainerClientProjectTasks = (
    userId: string,
    projectId: string
) => {
    const url = path(APIRoutes.Trainer.Tasks.TasksProject, {
        userId,
        projectId,
    });

    return http
        .get<TaskResponse[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};


export const GetTrainerClientSprintStandup = (
    userId: string,
    sprintId: string
) => {
    const url = path(APIRoutes.Trainer.Standup.Standup, {
        userId,
        sprintId,
    });
    return http
        .get<ProjectResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetTrainerClientSprintReflection = (
    userId: string,
    sprintId: string
) => {
    const url = path(APIRoutes.Trainer.Reflection.Reflection, {
        userId,
        sprintId,
    });
    return http
        .get<ProjectResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};