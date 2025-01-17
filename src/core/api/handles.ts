import {
    LoginByTelegram,
    Logout,
    RefreshToken,
    TestLogin,
} from './actions/auth';
import { GetMyInformation, GetMyRoles } from './actions/me';
import {
    GetAllSprintProjects,
    GetProject,
    PostProject,
    PutProject,
} from './actions/projects';
import { GetAllSprints, GetSprint } from './actions/sprints';
import { GetAllProjectTasks, PostTask, PutTask } from './actions/tasks';
import {
    EditTrainerCientComment,
    GetTrainerClientComment,
    GetTrainerClients,
} from './actions/trainer.clients';
import {
    GetTrainerClientSprints,
    GetTrainerClienttProjectTasks,
} from './actions/trainer.events';

/**
 * Объект доступных методов обращения к севреру.
 * Методы вызываются в прикладных компонентах
 * @example Пример вызова:
 * API.AUTH.login({ data: {...} })
 */
export const API = {
    AUTH: {
        /**
         * Авторизация через телеграм. Вызывать в коллбэке tg-виджета
         */
        Login: LoginByTelegram,

        /**
         * Обновление токенов. Вызывается в AuthProvider`e
         */
        Refresh: RefreshToken,

        /**
         * Выход из аккаунта
         */
        Logout,

        /**
         * [НЕ ДОЛЖНО ИСПОЛЬЗОВАТЬСЯ НА БОЮ]
         * Тестовая авторизация с помощью логина и пароля
         */
        TestLogin,
    },
    SPRINTS: {
        /**
         * Получение информации о всех спринтах.
         * Первый элемент массива - текущий спринт, остальные - история
         */
        Sprints: GetAllSprints,

        /**
         * Получение информации о спринте по его id
         */
        Sprint: GetSprint,
    },
    PROJECTS: {
        /**
         * Получение всех проектов спринта по его sprintId
         */
        Projects: GetAllSprintProjects,

        /**
         * Получения проекта по его projectId
         */
        Project: GetProject,

        /**
         * Создает новый проект
         */
        CreateProject: PostProject,

        /**
         * Обновить существующий проект
         */
        UpdateProject: PutProject,
    },
    TASKS: {
        /**
         * Получение всех задач проекта по его projectId
         */
        Tasks: GetAllProjectTasks,

        /**
         * Создание новой задачи
         */
        CreateTask: PostTask,

        /**
         * Обновление существующей задачи
         */
        UpdateTask: PutTask,
    },
    ME: {
        /**
         * Получение списка ролей текущего пользователя
         */
        Roles: GetMyRoles,

        /**
         * Получение персольнах данных и настроек текущего пользователя
         */
        Me: GetMyInformation,
    },
    TRAINER: {
        CLIENTS: {
            /**
             * Получение информации о клиентах тренера
             */
            Clients: GetTrainerClients,
        },
        SPRINTS: {
            /**
             * Получение информации о спринтах клиента по клиентскому userId
             */
            Sprints: GetTrainerClientSprints,
        },
        PROJECTS: {
            /**
             * Получение информации о проектах клиента по userId и sprintId
             */
            Projects: GetTrainerClienttProjectTasks,
        },
        TASKS: {
            /**
             * Получение информации о задачах клиента по userId и projectId
             */
            Tasks: GetTrainerClienttProjectTasks,
        },
        COMMENTS: {
            GetComment: GetTrainerClientComment,
            EditComment: EditTrainerCientComment,
        },
    },
};

/**
 * Объект всех доступных эндпоинтов сервера.
 * Не должен использоваться для вызова эндпоинтов напрямую!
 * Используется только для написания методов обращения, которые добавляются в объект API
 */
export const APIRoutes = {
    User: {
        ExternalTelegramLogin: '/User/ExternalTelegramLogin',
        RefreshToken: '/User/RefreshToken',
        Logout: '/User/Logout',
        Login: '/User/Login',
    },
    Sprints: {
        Sprints: '/api/Sprints',
        Sprint: '/api/Sprints/:sprintId',
    },
    Projects: {
        ProjectsSprint: '/api/Projects/sprint/:sprintId',
        Project: '/api/Projects/:projectId',
        Projects: '/api/Projects',
    },
    Tasks: {
        TasksProject: '/api/Tasks/project/:projectId',
        Tasks: '/api/Tasks',
    },
    Me: {
        Roles: '/api/Me/roles',
        Me: '/api/Me',
    },
    Trainer: {
        Clients: {
            Clients: '/api/Trainer/clients',
        },
        Sprints: {
            Sprints: '/api/Trainer/clients/:userId/sprints/',
        },
        Projects: {
            ProjectsSprint:
                '/api/Trainer/clients/:userId/projects/sprint/:sprintId',
        },
        Tasks: {
            TasksProject: '/api/Trainer/clients/:userId/tasks/:projectId',
        },
        Comments: {
            Comment: '/api/Trainer/:userId/comment',
        },
    },
};
