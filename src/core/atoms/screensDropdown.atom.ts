import { atom } from 'recoil';
import { SprintWeekDropdownValueType } from '../../application/screens/home/constants';
import { DropdownItem } from '../../Platform/_dropdownSelector/DropdownSelector';
import { persistAtom } from '../api/utils/atomPersistenceMaker';

export const SprintDropdownSelectedAtom = atom<DropdownItem<SprintWeekDropdownValueType>>({
    key: 'sprintDropdownSelected',
    default: null,
});

export const HistoryDropdownSelectedAtom = persistAtom('historyDropdownSelected', null);

export const ClientSprintDropdownSelectedAtom = atom<DropdownItem<SprintWeekDropdownValueType>>({
    key: 'clientSprintDropdownSelected',
    default: null,
});

export const ClientStandupDropdownSelectedAtom = persistAtom('clientStandupDropdownSelected', null);


export const ClientReflectionDropdownSelectedAtom = persistAtom('clientReflectionDropdownSelected', null);

export const ReflectionDropdownSelectedAtom = persistAtom('reflectionDropdownSelected', null);


export const StandupDropdownSelectedAtom = persistAtom('standupDropdownSelected', null);