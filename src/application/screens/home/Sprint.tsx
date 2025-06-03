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
import LoadingScreen from '../loading/Loading';
import useHttpLoader from '../../../core/api/hooks/useHttpLoader';
import { isDateBetween } from '../../../core/api/utils/DateDiff';

export type ExpanderClickHandlerType = (
    id: string,
    expanded: boolean,
    sectionName: MainSectionType
) => void;

function Sprint() {
    const { wait, loading } = useHttpLoader();

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
        let defaultSelectedItem : DropdownItem<SprintWeekDropdownValueType> = 
        {
            caption: 'Все недели',
            hint:
                !currentSprint.beginDate || !currentSprint.endDate
                    ? ''
                    : cutDate(currentSprint.beginDate) +
                      DROPDOWN_DATES_SEPARATOR +
                      cutDate(currentSprint.endDate),
            value: null,
        };

        const currentDate = new Date();
        const currentDateStr = currentDate.getFullYear().toString() + '-' + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' + currentDate.getDate().toString().padStart(2, '0');

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
            if (
            (index == 0 && currentDate.toDateString() != new Date(weeks[key].begin).toDateString())
            || (index == meInformation.sprintWeeksCount - 1 && currentDate.toDateString() != new Date(weeks[key].end).toDateString())
            || (index != 0 && index != meInformation.sprintWeeksCount - 1)
            )
            {
                defaultSelectedItem = isDateBetween(currentDateStr, weeks[key].begin, weeks[key].end) ? 
                {
                    caption: `Неделя ${key}`,
                    hint:
                        !begin || !end
                            ? ''
                            : cutDate(begin) +
                              DROPDOWN_DATES_SEPARATOR +
                              cutDate(end),
                    value: (index + 1) as SprintWeekDropdownValueType,
                }
                : defaultSelectedItem
            }
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

            return values.length ? values[0] : defaultSelectedItem;
        });
    }, [meInformation, currentSprint]);

    useEffect(() => {
        if (currentSprint.number || currentSprint.number == '0') {
            setProjectsPromise(() => API.PROJECTS.Projects(currentSprint.number));
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
        userSprintId: currentSprint.number,

        useDropdownItems: [
            dropdownItems,
            selectedDropdownItem,
            setSelectedDropdownItem,
        ],
        projectsSourceMethodPromise: projectsPromise,
        tasksByProjectCallback: (projectId) => API.TASKS.Tasks(projectId),
    };

    return (loading ? 
        (<LoadingScreen />)
     : (<BaseRegistry {...registryProps} />))
}

export default Sprint;
