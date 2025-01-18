import {
    SprintWeekDropdownValueType,
    DROPDOWN_DATES_SEPARATOR,
    BaseRegistryType,
} from './constants';
import { DropdownItem } from '../../../Platform/_dropdownSelector/DropdownSelector';
import { PossibleDatesResponseKeysType } from '../../../core/api/actions/sprints';
import { MainSectionType } from '../../../Platform/_types/Statuses';
import BaseRegistry, { BaseRegistryProps } from './BaseRegistry';
import CurrentSprintAtom from '../../../core/atoms/sprint.atom';
import MeInformationAtom from '../../../core/atoms/me.atom';
import { API } from '../../../core/api/handles';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import './SprintStyle.css';
import { cutDate } from '../../../core/api/utils/dateCutter';
import { SprintDropdownSelectedAtom } from '../../../core/atoms/screensDropdown.atom';
import { Navigate } from 'react-router-dom';
import { Routes } from '../../../core/routing/routes';
import OnboardingScreen from '../onboarding/Onboarding';

export type ExpanderClickHandlerType = (
    id: string,
    expanded: boolean,
    sectionName: MainSectionType
) => void;

function Sprint() {
    const currentSprint = useRecoilValue(CurrentSprintAtom);
    const meInformation = useRecoilValue(MeInformationAtom);
    const setMeInformation = useSetRecoilState(MeInformationAtom);

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        SprintDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<
        DropdownItem<SprintWeekDropdownValueType>[]
    >([]);

    //========= USE EFFECTS ===========
    useEffect(() => {
        const weeks = currentSprint.weeks;
        const newItems: DropdownItem<SprintWeekDropdownValueType>[] = [];

        Object.keys(weeks).map((key: PossibleDatesResponseKeysType, index) => {
            const begin = weeks[key].begin;
            const end = weeks[key].end;
            if (index < (meInformation.sprintWeeksCount || 4))
                newItems.push({
                    caption: `Неделя ${key}`,
                    hint:
                        !begin || !end
                            ? ''
                            : cutDate(begin) +
                              DROPDOWN_DATES_SEPARATOR +
                              cutDate(end),
                    value: (index + 1) as SprintWeekDropdownValueType,
                });
        });

        newItems.push({
            caption: 'Все недели',
            hint:
                !currentSprint.beginDate || !currentSprint.endDate
                    ? ''
                    : cutDate(currentSprint.beginDate) +
                      DROPDOWN_DATES_SEPARATOR +
                      cutDate(currentSprint.endDate),
            value: null,
        });

        setdropdownItems(() => [...newItems]);
        setSelectedDropdownItem((prev) => {
            const values = newItems.filter(
                (item) => item.value === prev?.value
            );

            return values.length ? values[0] : newItems[newItems.length - 1];
        });
    }, [meInformation, currentSprint]);

    useEffect(() => {
        if (currentSprint.id) {
            setProjectsPromise(() => API.PROJECTS.Projects(currentSprint.id));
        }
    }, [currentSprint]);

    useEffect(() => {
        API.ME.Me().then((res) => {
            if (res.isSuccess) {
                setMeInformation(() => res.body);
            }
        });
    }, []);

    // ====================================

    const [projectsPromise, setProjectsPromise] = useState(null);

    const registryProps: BaseRegistryProps<SprintWeekDropdownValueType> = {
        editingSettings: {
            editProjects: true,
            editTasks: true,
            editInDialogMode: true,
        },
        registryType: BaseRegistryType.MainSprint,

        useDropdownItems: [
            dropdownItems,
            selectedDropdownItem,
            setSelectedDropdownItem,
        ],
        projectsSourceMethodPromise: projectsPromise,
        tasksByProjectCallback: (projectId) => API.TASKS.Tasks(projectId),
    };

    return meInformation.isOnboardingComplete ? (
        <BaseRegistry {...registryProps} />
    ) : (
        <OnboardingScreen />
    );
}

export default Sprint;
