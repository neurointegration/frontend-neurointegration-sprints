import {
    LoginByTelegram,
    Logout,
    RefreshToken,
    TestLogin,
} from './actions/auth';
import {
    GetMyInformation,
    GetMyRoles,
    GetMyTrainer,
    PostMyTrainer,
    PutMyInformation,
    SetMyRoles,
} from './actions/me';
import {
    DeleteProject,
    GetAllSprintProjects,
    GetProject,
    PostProject,
    PutProject,
} from './actions/projects';
import { GetSprintReflection } from './actions/reflection';
import { GetAllSprints, GetSprint } from './actions/sprints';
import { GetSprintStandup } from './actions/standup';
import { DeleteTask, GetAllProjectTasks, GetProjectTask, PostTask, PutTask } from './actions/tasks';
import {
    EditTrainerCientComment,
    GetClient,
    GetTrainerClientComment,
    GetTrainerClients,
} from './actions/trainer.clients';
import {
    GetTrainerClientSprints,
    GetTrainerClientProjectTasks,
    GetTrainerClientSprintProjects,
    GetTrainerClientSprintStandup,
    GetTrainerClientSprintReflection,
    PutTrainerClientSprintProject,
    PostTrainerClientSprintProject,
    PostTrainerClientSprintTask,
    PutTrainerClientSprintTask,
    DeleteTrainerClientSprintProject,
    DeleteTrainerClientTask,
    GetTrainerClientProjectTask,
    GetTrainerClientSprintProject,
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
         * Получение всех проектов спринта по его sprintNumber
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

        DeleteteProject: DeleteProject,

    },
    TASKS: {
        /**
         * Получение всех задач проекта по его projectId
         */
        Tasks: GetAllProjectTasks,

        Task: GetProjectTask,

        /**
         * Создание новой задачи
         */
        CreateTask: PostTask,

        /**
         * Обновление существующей задачи
         */
        UpdateTask: PutTask,

        DeleteteTask: DeleteTask,

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

        Trainer: GetMyTrainer,
        PutMe: PutMyInformation,
        SetTrainer: PostMyTrainer,
        SetRoles: SetMyRoles,
    },

    STANDUP: {
        GetStandup: GetSprintStandup,
    },

    REFLECTION: {
        GetReflection: GetSprintReflection,
    },

    TRAINER: {
        CLIENTS: {
            /**
             * Получение информации о клиентах тренера
             */
            Clients: GetTrainerClients,

            /**
             * Получение информации об одном клиенте
             */
            Client: GetClient,
        },
        SPRINTS: {
            /**
             * Получение информации о спринтах клиента по клиентскому userId
             */
            Sprints: GetTrainerClientSprints,
        },
        PROJECTS: {

        Project: GetTrainerClientSprintProject,
            /**
             * Получение информации о проектах клиента по userId и sprintNumber
             */
            Projects: GetTrainerClientSprintProjects,
                    /**
         * Создает новый проект
         */
            CreateProject: PostTrainerClientSprintProject,

        /**
         * Обновить существующий проект
         */
            UpdateProject: PutTrainerClientSprintProject,

            DeleteteProject: DeleteTrainerClientSprintProject,
        },
        TASKS: {

            Task: GetTrainerClientProjectTask,

            /**
             * Получение информации о задачах клиента по userId и projectId
             */
            Tasks: GetTrainerClientProjectTasks,

                    /**
         * Создание новой задачи
         */
            CreateTask: PostTrainerClientSprintTask,

        /**
         * Обновление существующей задачи
         */
            UpdateTask: PutTrainerClientSprintTask,

            DeleteteTask: DeleteTrainerClientTask,

        },
        COMMENTS: {
            GetComment: GetTrainerClientComment,
            EditComment: EditTrainerCientComment,
        },

        STANDUP: {
            GetStandup: GetTrainerClientSprintStandup,
        },
    
        REFLECTION: {
            GetReflection: GetTrainerClientSprintReflection,
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
        ExternalTelegramLogin: '/api/User/ExternalTelegramLogin',
        RefreshToken: '/api/User/RefreshToken',
        Logout: '/api/User/Logout',
        Login: '/api/User/Login',
    },   
    Sprints: {
        Sprints: '/api/Sprints',
        Sprint: '/api/Sprints/:sprintNumber',
    },
    Projects: {
        ProjectsSprint: '/api/Projects/sprint/:sprintNumber',
        Project: '/api/Projects/:projectId',
        Projects: '/api/Projects',
    },
    Standup: {
        StandupSprint: '/api/standup/sprint/:sprintNumber',
        Standups: '',
    },
    Reflection: {
        ReflectionSprint: '/api/reflection/sprint/:sprintNumber',
        Reflections: '',
    },
    Tasks: {
        TasksProject: '/api/Tasks/project/:projectId',
        Tasks: '/api/Tasks',
        Task: '/api/Tasks/:taskId'
    },
    Me: {
        Roles: '/api/Me/roles',
        Me: '/api/Me',
        Trainer: '/api/Me/trainer',
    },
    Trainer: {
        Clients: {
            Clients: '/api/Trainer/clients',
            Client: '/api/Trainer/clients/:userId',
        },
        Sprints: {
            Sprints: '/api/Trainer/clients/:userId/sprints/',
        },
        Projects: {
            ProjectsSprint: '/api/Trainer/clients/:userId/projects/sprint/:sprintNumber',
            Projects: '/api/Trainer/clients/:userId/projects',
            Project: '/api/Trainer/clients/:userId/projects/:projectId'
        },
        Tasks: {
            TasksProject: '/api/Trainer/clients/:userId/tasks/:projectId',
            Tasks: '/api/Trainer/clients/:userId/tasks',
            Task: '/api/Trainer/clients/:userId/tasks/:taskId'
        },
        Comments: {
            Comment: '/api/Trainer/:userId/comment',
        },
        Reflection: {
            Reflection: '/api/Trainer/clients/:userId/reflection/sprint/:sprintNumber'
        },
        Standup: {
            Standup: '/api/Trainer/clients/:userId/standup/sprint/:sprintNumber'
        }
    },
};


/*
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Dto;
using Service;
using Api.Extensions;

namespace Api.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class SprintAnswersController : ControllerBase
    {
        private readonly ISprintAnswerService _sprintAnswerService;

        public SprintAnswersController(ISprintAnswerService sprintAnswerService)
        {
            _sprintAnswerService = sprintAnswerService;
        }

        [HttpGet("standup/sprint/{sprintNumber}")]
        public async Task<ActionResult<IList<StandupResponse>>> GetStandup(long sprintNumber)
        {
            var userId = User.GetUserId();
            var standup = await _sprintAnswerService.GetStandupAsync(userId, sprintNumber);
            return Ok(standup);
        }

        [HttpGet("standups")]
        public async Task<ActionResult<IList<StandupResponse>>> GetAllStandups()
        {
            var userId = User.GetUserId();
            var standups = await _sprintAnswerService.GetAllStandupsAsync(userId);
            return Ok(standups);
        }

        [HttpGet("reflection/sprint/{sprintNumber}")]
        public async Task<ActionResult<IList<ReflectionResponse>>> GetReflection(long sprintNumber)
        {
            var userId = User.GetUserId();
            var reflection = await _sprintAnswerService.GetReflectionAsync(userId, sprintNumber);
            return Ok(reflection);
        }

        [HttpGet("reflections")]
        public async Task<ActionResult<IList<ReflectionResponse>>> GetAllReflections()
        {
            var userId = User.GetUserId();
            var reflections = await _sprintAnswerService.GetAllReflectionsAsync(userId);
            return Ok(reflections);
        }
    }
}

*/