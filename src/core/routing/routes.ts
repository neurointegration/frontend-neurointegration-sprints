import { generatePath } from 'react-router-dom';

export enum Routes {
    Base = '/',
    Sprint = '/sprint',
    Settings = '/settigs',
    Clients = '/clients',
    Editing = '/editing/:eventType/:id',
}

export const path = generatePath;
