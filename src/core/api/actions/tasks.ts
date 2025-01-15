import { MainSectionType } from '../../../Platform/_types/Statuses';
import { path } from '../../routing/routes';
import { APIRoutes } from '../handles';
import http, {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';
import { TaskOrProjectTimeDescriptorType } from './projects';

type TaskResponse = {
    id: string;
    title: string;
    sectionName: MainSectionType;
    planningTimes: TaskOrProjectTimeDescriptorType;
    factTimes: TaskOrProjectTimeDescriptorType;
};

export const GetAllProjectTasks = (projectId: string) => {
    const url = path(APIRoutes.Tasks.TasksProject, { projectId });

    return http
        .get<TaskResponse[]>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
