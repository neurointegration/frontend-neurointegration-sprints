import { generatePath } from 'react-router-dom';

export enum Routes {
    Base = '/',
    Sprint = '/sprint',
    Settings = '/settings',
    Clients = '/clients',
    Editing = '/editing/:eventType/:id',
    Readonly = '/history/:eventType/:id',
    Creation = '/creation/:eventType',
    Onboarding = '/onboarding',
    OnboardingShort = '/short/onboarding',
    History = '/history',
    ClientSprint = '/sprint/:clientId',
    ClientStandup = '/standup/:clientId',
    ClientReflection = '/reflection/:clientId',
    Reflection = '/reflection',
    Standup = '/standup',
}

/**
 * Утилита генерации пути.
 * Подставляет вместо параметров вида ':id' их переданные значения в url.
 * Дополнительно проверяет типизацию.
 * @remark
 * ПРИ ИСПОЛЬЗОВАНИИ В ПУТЯХ ЗАПРОСОВ API:
 * не нужно добавлять ROOT_PATH
 */
export const path = generatePath;
