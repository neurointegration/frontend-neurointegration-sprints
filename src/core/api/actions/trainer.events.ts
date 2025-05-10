import http, {
    handleHttpResponse,
    handleHttpError,
} from '../utils/httpHandlers';
import { ProjectRequestType, ProjectResponseType, PutProjectRequest } from './projects';
import { SprintResponseType } from './sprints';
import { path } from '../../routing/routes';
import { PutTaskRequest, TaskRequest, TaskResponse } from './tasks';
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
    sprintNumber: string
) => {
    const url = path(APIRoutes.Trainer.Projects.ProjectsSprint, {
        userId,
        sprintNumber,
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
    sprintNumber: string
) => {
    const url = path(APIRoutes.Trainer.Standup.Standup, {
        userId,
        sprintNumber,
    });
    return http
        .get<ProjectResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetTrainerClientSprintReflection = (
    userId: string,
    sprintNumber: string
) => {
    const url = path(APIRoutes.Trainer.Reflection.Reflection, {
        userId,
        sprintNumber,
    });
    return http
        .get<ProjectResponseType[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const PostTrainerClientSprintProject = (
    userId: string,  
    projectData: ProjectRequestType
) => {
    const url = path(APIRoutes.Trainer.Projects.Projects, { userId });
    return http
        .post(url, { ...projectData })
        .then(handleHttpResponse)
        .catch(handleHttpError);
}

export const PutTrainerClientSprintProject = (
    userId: string,  
    projectData: PutProjectRequest
) => {
    const url = path(APIRoutes.Trainer.Projects.Projects, { userId });
    return http
        .put(url, { ...projectData })
        .then(handleHttpResponse)
        .catch(handleHttpError);
}

export const PostTrainerClientSprintTask = (
    userId: string,  
    taskData: TaskRequest
) => {
    const url = path(APIRoutes.Trainer.Tasks.Tasks, { userId });
    return http
        .post(url, { ...taskData })
        .then(handleHttpResponse)
        .catch(handleHttpError);
}

export const PutTrainerClientSprintTask = (
    userId: string,  
    taskData: PutTaskRequest
) => {
    const url = path(APIRoutes.Trainer.Tasks.Tasks, { userId });
    return http
        .put(url, { ...taskData })
        .then(handleHttpResponse)
        .catch(handleHttpError);
}

export const DeleteTrainerClientSprintProject = (
    userId: string,
    projectId: string,
) => {
    const url = path(APIRoutes.Trainer.Projects.Project, {
        projectId,
        userId,
    });
    return http
        .delete(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const DeleteTrainerClientTask = (
    userId: string,
    taskId: string
) => {
    const url = path(APIRoutes.Trainer.Tasks.Task, {
        userId,
        taskId,
    });
    return http
        .delete(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};


/*
export const EditTrainerCientComment = (userId: string, newComment: string) => {
    const url = path(APIRoutes.Trainer.Comments.Comment, { userId });
    return http
        .post<CommentResponseType>(url, { userId, commentText: newComment })
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


*/