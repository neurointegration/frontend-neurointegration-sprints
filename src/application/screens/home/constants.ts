import { SectionType } from '../../../Platform/_tabs/TabType';

// export const CurrentSprintDropdownValue = {
//     week1: 'week1',
//     week2: 'week2',
//     week3: 'week3',
//     week4: 'week4',
//     allWeeks: 'allWeeks',
// };

export type SprintWeekDropdownValueType = 1 | 2 | 3 | 4 | null;

export const SECTIONS: SectionType[] = [
    {
        caption: 'Лайф',
        value: 'Life',
    },
    {
        caption: 'Кайф',
        value: 'Fun',
    },
    {
        caption: 'Драйв',
        value: 'Drive',
    },
];
export const DROPDOWN_DATES_SEPARATOR = ' – ';

export enum BaseRegistryType {
    MainSprint = 'mainSprint',
    History = 'historySprnts',
    ClientSprint = 'clientSprint',
}
