import { useState } from 'react';
import { RegistryItemType } from '../_registry/EventRegistry';
import { TaskOrProjectTimeDescriptorType } from '../../../core/api/actions/projects';
import { FlatEditingItemChangesType } from '../../screens/editing/EventEditingContext';
import { EventCardType, EventType } from '../_cards/_types/EventCardType';
import { UseTimeEditorValue } from '../../../Platform/_times/TimeEditor';
import { API } from '../../../core/api/handles';
import { MainSectionType } from '../../../Platform/_types/Statuses';
import { useRecoilValue } from 'recoil';
import CurrentSprintAtom from '../../../core/atoms/sprint.atom';
import { useNavigate } from 'react-router-dom';

export type FormControllerType = {
    usePlanningTimes: UseTimeEditorValue;
    useFactTimes: UseTimeEditorValue;
    useEventTitle: [string, React.Dispatch<React.SetStateAction<string>>];
    useChanges: [
        FlatEditingItemChangesType,
        React.Dispatch<React.SetStateAction<FlatEditingItemChangesType>>
    ];
    saveHandler: (sprintId?: string, navigateTo?: number) => void;
};

// const API_METHODS = {
//     creation: {
//         [EventType.Task]: API.TASKS.CreateTask,
//         [EventType.Project]: API.PROJECTS.CreateProject,
//     },
//     editing: {
//         [EventType.Task]: API.TASKS.UpdateTask,
//         [EventType.Project]: API.PROJECTS.UpdateProject,
//     },
// };

const EditorFormController = (
    itemDescriptor: RegistryItemType | null,
    isCreation: boolean,
    eventType: EventType,
    sectionName: MainSectionType,
    projectId?: string
): FormControllerType => {
    const navigate = useNavigate();
    const currentSprint = useRecoilValue(CurrentSprintAtom);
    const restructuredItem = isCreation
        ? null
        : _restructurizeEditingItem(itemDescriptor);
    const useChanges = useState(null);

    const usePlanningTimes = useState<TaskOrProjectTimeDescriptorType>(
        restructuredItem?.planningTimes
    );

    const useFactTimes = useState<TaskOrProjectTimeDescriptorType>(
        restructuredItem?.factTimes
    );

    const useEventTitle = useState<string>(restructuredItem?.title || '');

    const saveHandler = (clientSprintId: string = null, navigateTo = -1) => {
        // const apiMethod:
        //     | typeof API.PROJECTS.CreateProject
        //     | typeof API.PROJECTS.UpdateProject
        //     | typeof API.TASKS.CreateTask
        //     | typeof API.TASKS.UpdateTask =
        //     API_METHODS[isCreation ? 'creation' : 'editing'][eventType];

        let methodCall;
        let params;
        if (isCreation && eventType === EventType.Project) {
            params = {
                title: useEventTitle[0],
                sectionName,
                sprintId: clientSprintId || currentSprint.id,
                ...useChanges[0],
            };
            methodCall = API.PROJECTS.CreateProject(params);
        } else if (!isCreation && eventType === EventType.Project) {
            params = {
                id: itemDescriptor.id,
                ...restructuredItem,
                ...useChanges[0],
            };
            methodCall = API.PROJECTS.UpdateProject(params);
        } else if (isCreation && eventType === EventType.Task) {
            params = {
                projectId,
                sectionName,
                title: useEventTitle[0],
                ...useChanges[0],
            };
            methodCall = API.TASKS.CreateTask(params);
        } else {
            params = {
                id: itemDescriptor.id,
                ...restructuredItem,
                ...useChanges[0],
            };
            methodCall = API.TASKS.UpdateTask(params);
        }

        methodCall.finally(() => {
            navigate(navigateTo);
        });
    };

    return {
        usePlanningTimes,
        useFactTimes,
        useEventTitle,
        useChanges,
        saveHandler,
    };
};

export default EditorFormController;

const _restructurizeEditingItem = (
    registryItemDescriptor: RegistryItemType
) => {
    // if (!registryItemDescriptor) {
    //     return null;
    // }
    const item = registryItemDescriptor?.item as EventCardType;
    const result: FlatEditingItemChangesType = {
        title: item.title,
        planningTimes: item.timeValues.planningTimes,
        factTimes: item.timeValues.factTimes,
    };

    return result;
};
