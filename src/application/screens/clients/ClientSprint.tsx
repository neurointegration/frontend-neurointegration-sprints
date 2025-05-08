import { useState, useEffect, useLayoutEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
    PossibleDatesResponseKeysType,
    SprintResponseType,
} from '../../../core/api/actions/sprints';
import { API } from '../../../core/api/handles';
import { cutDate } from '../../../core/api/utils/dateCutter';
import MeInformationAtom from '../../../core/atoms/me.atom';
import {
    ClientSprintDropdownSelectedAtom,
    SprintDropdownSelectedAtom,
} from '../../../core/atoms/screensDropdown.atom';
import CurrentSprintAtom from '../../../core/atoms/sprint.atom';
import { DropdownItem } from '../../../Platform/_dropdownSelector/DropdownSelector';
import BaseRegistry, { BaseRegistryProps } from '../home/BaseRegistry';
import {
    SprintWeekDropdownValueType,
    DROPDOWN_DATES_SEPARATOR,
    BaseRegistryType,
} from '../home/constants';
import useHttpLoader from '../../../core/api/hooks/useHttpLoader';
import { useParams } from 'react-router-dom';
import Spoiler from '../../../Platform/_buttons/Spoiler';
import LoadingScreen from '../loading/Loading';
import { ClientResponseType } from '../../../core/api/actions/trainer.clients';

import './ClientSprintStyle.css';

function ClientSprintScreen() {
    const params = useParams();
    const clientId = params.clientId;
    const { wait, loading } = useHttpLoader();
    const [currentSprint, setCurrentSprint] = useState<SprintResponseType>({
        number: null,
        weeksCount: 0,
        beginDate: null,
        endDate: null,
        weeks: {},
    });
    const meInformation = useRecoilValue(MeInformationAtom);

    const [selectedDropdownItem, setSelectedDropdownItem] = useRecoilState(
        ClientSprintDropdownSelectedAtom
    );

    const [dropdownItems, setdropdownItems] = useState<
        DropdownItem<SprintWeekDropdownValueType>[]
    >([]);

    const [client, setClient] = useState<ClientResponseType>({
        id: clientId,
        username: null,
        firstName: null,
        lastName: null,
        aboutMe: null,
        photoUrl: null,
    });

    const [comment, setComment] = useState<string>(null);

    //========= USE EFFECTS ===========
    useEffect(() => {
        wait(API.TRAINER.SPRINTS.Sprints(clientId), (resp) => {
            if (resp.isSuccess) {
                if (resp.body.length) {
                    setCurrentSprint(() => resp.body[0]);
                }
            }
        });

        wait(API.TRAINER.CLIENTS.Client(clientId), (resp) => {
            if (resp.isSuccess) {
                setClient(() => ({ ...resp.body }));
            }
        });

        wait(API.TRAINER.COMMENTS.GetComment(clientId), (resp) => {
            if (resp.isSuccess) {
                setComment(() => resp.body.commentText);
            }
        });
    }, []);

    useEffect(() => {
        const weeks = currentSprint?.weeks;
        const newItems: DropdownItem<SprintWeekDropdownValueType>[] = [];

        Object.keys(weeks).map((key: PossibleDatesResponseKeysType, index) => {
            const begin = weeks[key].begin;
            const end = weeks[key].end;
            if (index < (meInformation.sprintWeeksCount || 4))
                newItems.push({
                    caption: `Неделя ${key}`,
                    hint:
                        cutDate(begin) +
                        DROPDOWN_DATES_SEPARATOR +
                        cutDate(end),
                    value: (index + 1) as SprintWeekDropdownValueType,
                });
        });

        newItems.push({
            caption: 'Все недели',
            hint:
                cutDate(currentSprint?.beginDate) +
                DROPDOWN_DATES_SEPARATOR +
                cutDate(currentSprint?.endDate),
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
        if (currentSprint?.number) {
            setProjectsPromise(() =>
                API.TRAINER.PROJECTS.Projects(clientId, currentSprint?.number)
            );
        }
    }, [currentSprint]);

    // ====================================

    const [projectsPromise, setProjectsPromise] = useState(null);

    const registryProps: BaseRegistryProps<SprintWeekDropdownValueType> = {
        editingSettings: {
            editProjects: true,
            editTasks: true,
            editInDialogMode: true,
        },
        registryType: BaseRegistryType.ClientSprint,
        userSprintId: currentSprint.number,
        useDropdownItems: [
            dropdownItems,
            selectedDropdownItem,
            setSelectedDropdownItem,
        ],
        projectsSourceMethodPromise: projectsPromise,
        tasksByProjectCallback: (projectId) => API.TASKS.Tasks(projectId),
    };

    return loading ? (
        <LoadingScreen />
    ) : (
        <>
            <Spoiler
                title={client?.firstName || 'Имя клиента'}
                buttonClassName='clientButtonSpoiler'
            >
                {comment && (
                    <div className='clientButton__comment'>{comment}</div>
                )}
            </Spoiler>
            <BaseRegistry {...registryProps} />
        </>
    );
}

export default ClientSprintScreen;
