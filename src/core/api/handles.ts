import {
    LoginByTelegram,
    Logout,
    RefreshToken,
    TestLogin,
} from './actions/auth';
import { GetMyInformation, GetMyRoles } from './actions/me';
import { GetAllSprintProjects, GetProject } from './actions/projects';
import { GetAllSprints, GetSprint } from './actions/sprints';
import { GetAllProjectTasks } from './actions/tasks';

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
    },
    TASKS: {
        /**
         * Получение всех задач проекта по его projectId
         */
        Tasks: GetAllProjectTasks,
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
    },
    Tasks: {
        TasksProject: '/api/Tasks/project/:projectId',
    },
    Me: {
        Roles: '/api/Me/roles',
        Me: '/api/Me',
    },
};
