import { atom } from 'recoil';
import { SprintWeekDropdownValueType } from '../../application/screens/home/constants';
import { DropdownItem } from '../../Platform/_dropdownSelector/DropdownSelector';

export const SprintDropdownSelectedAtom = atom<DropdownItem<SprintWeekDropdownValueType>>({
    key: 'sprintDropdownSelected',
    default: null,
});

export const HistoryDropdownSelectedAtom = atom<DropdownItem<string>>({
    key: 'historyDropdownSelected',
    default: null,
});

export const ClientSprintDropdownSelectedAtom = atom<DropdownItem<SprintWeekDropdownValueType>>({
    key: 'clientSprintDropdownSelected',
    default: null,
});

export const ClientStandupDropdownSelectedAtom = atom<DropdownItem<string>>({
    key: 'clientStandupDropdownSelected',
    default: null,
});

export const ClientReflectionDropdownSelectedAtom = atom<DropdownItem<string>>({
    key: 'clientReflectionDropdownSelected',
    default: null,
});

export const ReflectionDropdownSelectedAtom = atom<DropdownItem<string>>({
    key: 'reflectionDropdownSelected',
    default: null,
});

export const StandupDropdownSelectedAtom = atom<DropdownItem<string>>({
    key: 'standupDropdownSelected',
    default: null,
});