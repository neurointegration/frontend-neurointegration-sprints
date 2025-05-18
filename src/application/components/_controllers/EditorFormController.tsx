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
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRegistryProps } from '../../screens/home/BaseRegistry';
import { BaseRegistryType } from '../../screens/home/constants';

export type FormControllerType = {
    usePlanningTimes: UseTimeEditorValue;
    useFactTimes: UseTimeEditorValue;
    useEventSection: [MainSectionType, React.Dispatch<React.SetStateAction<MainSectionType>>]
    useEventTitle: [string, React.Dispatch<React.SetStateAction<string>>];
    useChanges: [
        FlatEditingItemChangesType,
        React.Dispatch<React.SetStateAction<FlatEditingItemChangesType>>
    ];
    saveHandler: (sprintId?: string, navigateTo?: number) => void;
    deleteHandler: (navigateTo?: number) => void;

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
    clientId: string | null,
    registryType: BaseRegistryType,
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

    const useEventSection = useState<MainSectionType>(restructuredItem?.section);


    const saveHandler = (clientSprintId: string = null, navigateTo = -1) => {
        // const apiMethod:
        //     | typeof API.PROJECTS.CreateProject
        //     | typeof API.PROJECTS.UpdateProject
        //     | typeof API.TASKS.CreateTask
        //     | typeof API.TASKS.UpdateTask =
        //     API_METHODS[isCreation ? 'creation' : 'editing'][eventType];

        let methodCall;
        let params;
        if (isCreation && eventType === EventType.Project && registryType === BaseRegistryType.ClientSprint) {
            params = {
                title: useEventTitle[0],
                sectionName: useEventSection[0],
                sprintNumber: clientSprintId || currentSprint.number,
                ...useChanges[0],
            };
            methodCall = API.TRAINER.PROJECTS.CreateProject(clientId, params);

        } else if (isCreation && eventType === EventType.Project) {
            params = {
                title: useEventTitle[0],
                sectionName: useEventSection[0],
                sprintNumber: clientSprintId || currentSprint.number,
                ...useChanges[0],
            };
            methodCall = API.PROJECTS.CreateProject(params);
        } else if (!isCreation && eventType === EventType.Project && registryType === BaseRegistryType.ClientSprint) {
            params = {
                id: itemDescriptor.id,
                title: useEventTitle[0],
                sectionName: useEventSection[0],
                ...restructuredItem,
                ...useChanges[0],
            };
            methodCall = API.TRAINER.PROJECTS.UpdateProject(clientId, params);
        } else if (!isCreation && eventType === EventType.Project) {
            params = {
                id: itemDescriptor.id,
                sectionName: useEventSection[0],
                title: useEventTitle[0],
                ...restructuredItem,
                ...useChanges[0],
            };
            methodCall = API.PROJECTS.UpdateProject(params);
        } else if (isCreation && eventType === EventType.Task && registryType === BaseRegistryType.ClientSprint) {
            params = {
                projectId,
                sectionName,
                title: useEventTitle[0],
                ...useChanges[0],
            };
            methodCall = API.TRAINER.TASKS.CreateTask(clientId, params);
        } else if (isCreation && eventType === EventType.Task) {
            params = {
                projectId,
                title: useEventTitle[0],
                ...useChanges[0],
            };
            methodCall = API.TASKS.CreateTask(params);
        } else if (!isCreation && eventType === EventType.Task && registryType === BaseRegistryType.ClientSprint) {
            params = {
                id: itemDescriptor.id,
                ...restructuredItem,
                ...useChanges[0],
            };
            methodCall = API.TRAINER.TASKS.UpdateTask(clientId, params);
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

    const deleteHandler = (navigateTo = -1) => {
        // const apiMethod:
        //     | typeof API.PROJECTS.CreateProject
        //     | typeof API.PROJECTS.UpdateProject
        //     | typeof API.TASKS.CreateTask
        //     | typeof API.TASKS.UpdateTask =
        //     API_METHODS[isCreation ? 'creation' : 'editing'][eventType];

        let methodCall;
        if (eventType === EventType.Project && registryType === BaseRegistryType.ClientSprint) {
            methodCall = API.TRAINER.PROJECTS.DeleteteProject(clientId, itemDescriptor.id);
        } else if (eventType === EventType.Project) {
            methodCall = API.PROJECTS.DeleteteProject(itemDescriptor.id);
        } else if (eventType === EventType.Task && registryType === BaseRegistryType.ClientSprint) {
            methodCall = API.TRAINER.TASKS.DeleteteTask(clientId, itemDescriptor.id);
        } else {
            methodCall = API.TASKS.DeleteteTask(itemDescriptor.id);
        }

        methodCall.finally(() => {
            navigate(navigateTo);
        });
    };

    return {
        usePlanningTimes,
        useEventSection,
        useFactTimes,
        useEventTitle,
        useChanges,
        saveHandler,
        deleteHandler,
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
        section: registryItemDescriptor.sectionName,
        planningTimes: item.timeValues.planningTimes,
        factTimes: item.timeValues.factTimes,
    };

    return result;
};
