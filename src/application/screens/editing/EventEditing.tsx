import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { EventType } from '../../components/_cards/_types/EventCardType';
import EventTitleEditor from '../../components/_editors/EventTitleEditor';
import Sidebar from '../../components/_sidebar/Sidebar';
import { SyntheticEvent, useEffect, useState } from 'react';
import clsx from 'clsx';
import Button from '../../../Platform/_buttons/Button';
import './EventEditingStyle.css';
import Spoiler from '../../../Platform/_buttons/Spoiler';
import EditorUnit from '../../components/_editors/EditorUnit';
import { RegistryItemType } from '../../components/_registry/EventRegistry';
import { useRecoilValue } from 'recoil';
import MeInformationAtom from '../../../core/atoms/me.atom';
import {
    EDITING_SPOILER_UNITS,
    EditingScreenFormContext,
    EditingFormContextPropertyChangedFuncType,
    EditingSpoilerUnitType,
} from './EventEditingContext';
import { Routes } from '../../../core/routing/routes';
import EditorFormController from '../../components/_controllers/EditorFormController';
import { API } from '../../../core/api/handles';
import CurrentSprintAtom from '../../../core/atoms/sprint.atom';
import { BaseRegistryProps } from '../home/BaseRegistry';
import { BaseRegistryType } from '../home/constants';

const baseScreenCN = 'screen-EventEditing';
const actionButtonsBlockCN = clsx(`${baseScreenCN}__actionButtonsBlock`);
const pageHeaderCN = clsx(`${baseScreenCN}__header`);
const pageContentCN = clsx(`${baseScreenCN}__pageContent`);
const actionButtonCN = clsx(
    `${baseScreenCN}__actionButton`,
    'controls-fontsize-m',
    'controls-fontweight-medium'
);
const spoilerButtonCN = clsx(
    'controls-margin_bottom-2xl',
    'controls-margin_top-3xl'
);

/**
 * Экран редактирования события.
 * Может открываться в режиме только для просмотра или в режиме создания события
 */
function EventEditingScreen() {
    const location = useLocation();
    const params = useParams();
    const eventType = params.eventType as EventType;
    const eventId = params.id;
    const creationMode = location.pathname.includes('creation');
    const readonly = location.pathname.includes('history');
    const navigate = useNavigate();

    const timeType = useRecoilValue(MeInformationAtom);

    const registryType = location.state.registryType as BaseRegistryType;
    const userSprintId = location.state.userSprintId;

    const registryItemDescriptor = creationMode
        ? null
        : (location.state.eventDescriptor as RegistryItemType);

    const parentProjectId =
        creationMode && eventType === EventType.Task
            ? (location.state.parentProjectId as string)
            : null;
    const sectionName = creationMode ? location.state.section : null;

    const CONTROLLER = EditorFormController(
        registryItemDescriptor,
        creationMode,
        eventType,
        sectionName,
        parentProjectId
    );

    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [spoilerUnits, setSpoilerUnits] = useState<EditingSpoilerUnitType[]>(
        EDITING_SPOILER_UNITS
    );

    // ============== USE EFFECTS =================
    // В случае тренера добавим вкладку "Клиенты"
    useEffect(() => {
        document.body.className = `body-color-white`;
        if (timeType.sprintWeeksCount !== 4) {
            setSpoilerUnits(() => {
                const res = [...EDITING_SPOILER_UNITS];
                delete res[4];
                return res;
            });
        }
    }, []);

    // Если в переданном стейте нет данных о событии и страница
    // открыта не на создание, редиректим на главную
    useEffect(() => {
        if (
            (!eventId || !location?.state?.eventDescriptor) &&
            !location.pathname.includes('creation')
        ) {
            navigate(Routes.Base);
        }
    }, []);

    // ============================================

    const submitHandler = (event: SyntheticEvent) => {
        event.preventDefault();
        CONTROLLER.saveHandler(userSprintId);
    };

    const propertyChanged: EditingFormContextPropertyChangedFuncType = (
        propertyKey,
        newValue
    ): void => {
        CONTROLLER.useChanges[1]((prev) => {
            const newChanges = { ...prev, [propertyKey]: newValue };
            // console.log(newChanges);

            setSaveButtonDisabled(() => !Object.keys(newChanges).length);
            return newChanges;
        });
    };

    const currentSprint = useRecoilValue(CurrentSprintAtom);
    const restoreClickHandler = () => {
        if (currentSprint.id) {
            API.PROJECTS.Project(eventId).then((res) => {
                if (res.isSuccess) {
                    const data = {
                        sprintId: currentSprint.id,
                        title: res.body.title,
                        sectionName: res.body.sectionName,
                        planningTimes: res.body.planningTimes,
                        factTimes: res.body.factTimes,
                    };
                    API.PROJECTS.CreateProject(data).then((createRes) => {
                        if (createRes.isSuccess) {
                            navigate(Routes.Base);
                        }
                    });
                }
            });
        }
    };

    const showRestoreButton = readonly && eventType === EventType.Project;

    return (
        <EditingScreenFormContext.Provider value={{ propertyChanged }}>
            <form onSubmit={submitHandler}>
                <div className={pageHeaderCN}>
                    <div className={actionButtonsBlockCN}>
                        {!showRestoreButton && (
                            <>
                                <Button
                                    onClick={() => navigate(-1)}
                                    className={actionButtonCN}
                                    caption='Отмена'
                                    size='small'
                                    type='button'
                                />
                                <Button
                                    disabled={
                                        showRestoreButton
                                            ? true
                                            : saveButtonDisabled
                                    }
                                    className={actionButtonCN}
                                    caption='Сохранить'
                                    size='small'
                                    type='submit'
                                />
                            </>
                        )}
                        {showRestoreButton && (
                            <Button
                                caption='Добавить в текущий спринт'
                                type='button'
                                onClick={restoreClickHandler}
                            />
                        )}
                    </div>
                    <Sidebar />
                </div>
                <div className={pageContentCN}>
                    <EventTitleEditor
                        useTitle={CONTROLLER.useEventTitle}
                        eventType={eventType}
                        disabled={readonly}
                    />
                    {spoilerUnits.map((spoilerItem, index) => (
                        <Spoiler
                            key={`spoilerItem_${index}`}
                            title={spoilerItem.title}
                            buttonClassName={spoilerButtonCN}
                            defaultOpen={spoilerItem.defaultOpen}
                        >
                            <EditorUnit
                                timeKey={spoilerItem.timeKey}
                                usePlanningTimes={CONTROLLER.usePlanningTimes}
                                useFactTimes={CONTROLLER.useFactTimes}
                                eventType={eventType}
                                disabled={readonly}
                            />
                        </Spoiler>
                    ))}
                </div>
            </form>
        </EditingScreenFormContext.Provider>
    );
}

export default EventEditingScreen;
