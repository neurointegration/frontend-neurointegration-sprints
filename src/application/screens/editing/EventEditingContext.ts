import { createContext } from 'react';
import { PossibleTimeResponceKeysType, TaskOrProjectTimeDescriptorType } from '../../../core/api/actions/projects';
import { MainSectionType } from '../../../Platform/_types/Statuses';

type ValueType<K extends keyof FlatEditingItemChangesType> =
    FlatEditingItemChangesType[K];

export type EditingFormContextPropertyChangedFuncType = <
    K extends keyof FlatEditingItemChangesType
>(
    propertyKey: K,
    newValue: ValueType<K>
) => void;

export type FlatEditingItemChangesType = {
    title?: string;
    section: MainSectionType
    planningTimes: TaskOrProjectTimeDescriptorType;
    factTimes: TaskOrProjectTimeDescriptorType;
};

export const EditingScreenFormContext = createContext<{
    propertyChanged: EditingFormContextPropertyChangedFuncType;
}>({ propertyChanged: null });

export type EditingSpoilerUnitType = {
    title: string;
    defaultOpen: boolean;
    timeKey: PossibleTimeResponceKeysType;
};

export const EDITING_SPOILER_UNITS: EditingSpoilerUnitType[] = [
    {
        title: 'Общее',
        defaultOpen: true,
        timeKey: 'total',
    },
    {
        title: 'Неделя 1',
        defaultOpen: false,
        timeKey: '1',
    },
    {
        title: 'Неделя 2',
        defaultOpen: false,
        timeKey: '2',
    },
    {
        title: 'Неделя 3',
        defaultOpen: false,
        timeKey: '3',
    },
    {
        title: 'Неделя 4',
        defaultOpen: false,
        timeKey: '4',
    },
];