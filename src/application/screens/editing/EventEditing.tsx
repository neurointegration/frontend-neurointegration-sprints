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
import { useRecoilValue, useSetRecoilState } from 'recoil';
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
import { MePutRequestType, OnboardingTypes } from '../../../core/api/actions/me';
import OnboardingCard, { OnboardingCardsForms } from '../../components/_cards/newOnboarding';
import OnboardingAtom from '../../../core/atoms/onboarding.atom';
import useHttpLoader from '../../../core/api/hooks/useHttpLoader';
import LoadingScreen from '../loading/Loading';
import EventSectionEditor from '../../components/_editors/EventSectionEditor';
import Delayed from '../../../core/api/utils/renderingDelayer';

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
    const locationEditing = useLocation();
    const { wait, loading } = useHttpLoader();

    const params = useParams();
    const eventType = params.eventType as EventType;
    const eventId = params.id;
    const creationMode = locationEditing.pathname.includes('creation');
    const readonly = locationEditing.pathname.includes('history');
    const navigate = useNavigate();

    const timeType = useRecoilValue(MeInformationAtom);
    const [isEditOnboardingShown, setIsEditOnboardingShown] = useState(true);
    

    const registryType = locationEditing.state.registryType as BaseRegistryType;
    const clientId = locationEditing.state.clientId as string;
    const userSprintId = locationEditing.state.userSprintId;

    const registryItemDescriptor = creationMode
        ? null
        : (locationEditing.state.eventDescriptor as RegistryItemType);

    const parentProjectId =
        creationMode && eventType === EventType.Task
            ? (locationEditing.state.parentProjectId as string)
            : null;
    const sectionName = creationMode ? locationEditing.state.section : null;

    const CONTROLLER = EditorFormController(
        clientId,
        registryType,
        registryItemDescriptor,
        creationMode,
        eventType,
        sectionName,
        parentProjectId
    );

    const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);

    const [spoilerUnits, setSpoilerUnits] = useState<EditingSpoilerUnitType[]>(
        EDITING_SPOILER_UNITS
    );

    const onboardingState = useRecoilValue(OnboardingAtom);
    const setOnboarding = useSetRecoilState(OnboardingAtom);

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
            (!eventId || !locationEditing?.state?.eventDescriptor) &&
            !locationEditing.pathname.includes('creation')
        ) {
            navigate(Routes.Base);
        }
    }, []);


    useEffect(() => {
        if (eventId && eventType == EventType.Project && registryType==BaseRegistryType.MainSprint) {
                API.PROJECTS.Project(eventId).then((res) => {
                if (res.isSuccess) {
                    setDeleteButtonDisabled(false);
                } else {
                    setDeleteButtonDisabled(true);
                }
            })
        } else if (eventId && eventType == EventType.Task && registryType==BaseRegistryType.MainSprint) {
                API.TASKS.Task(eventId).then((res) => {
                    if (res.isSuccess) {
                        setDeleteButtonDisabled(false);
                    } else {
                    setDeleteButtonDisabled(true);
                }
            })
        } else if (eventId && eventType == EventType.Project && registryType==BaseRegistryType.ClientSprint) {
            API.TRAINER.PROJECTS.Project(clientId, eventId).then((res) => {
                if (res.isSuccess) {
                    setDeleteButtonDisabled(false);
                } else {
                setDeleteButtonDisabled(true);
            }
        })
        } else if (eventId && eventType == EventType.Task && registryType==BaseRegistryType.ClientSprint) {
            API.TRAINER.TASKS.Task(clientId, eventId).then((res) => {
                if (res.isSuccess) {
                    setDeleteButtonDisabled(false);
                } else {
                setDeleteButtonDisabled(true);
            }
        })
    } else {
        setDeleteButtonDisabled(true);
    }});

    // ============================================

    const submitHandler = (event: SyntheticEvent) => {
        event.preventDefault();
        CONTROLLER.saveHandler(userSprintId);
    };

    const onboardingCardClickHandler = () => {
        const onboardingNew = 
            {...onboardingState, editingOnboarding: true};
        const data: MePutRequestType = {
            onboarding: onboardingNew,
        };

        API.ME.PutMe(data).then(() => {
            setOnboarding(onboardingNew)
        });
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
        if (currentSprint.number) {
            API.PROJECTS.Project(eventId).then((res) => {
                if (res.isSuccess) {
                    const data = {
                        sprintNumber: currentSprint.number,
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

    const deleteHandler = (event: SyntheticEvent) => {
                event.preventDefault();
                CONTROLLER.deleteHandler();
    };

    const showRestoreButton = readonly && eventType === EventType.Project;

    return (
        loading ? 
        <LoadingScreen />
     : 
        <div>
        <Delayed>
            {!onboardingState.editingOnboarding ? 
            <div className='onboarding-dark-overlay'/> :
            <></>}
            {!onboardingState.editingOnboarding ?
            <OnboardingCard form={OnboardingCardsForms.Simple} type={OnboardingTypes.EditingOnboarding} onboardingCardClickHandler={onboardingCardClickHandler}/>
            :
            <></>}    
        </Delayed>
        <h1 className='sr-only'>{showRestoreButton ? 'Информация о проекте' : eventType === EventType.Project ? 'Редактирование проекта' : 'Редактирование задачи'}</h1>
        <EditingScreenFormContext.Provider value={{ propertyChanged }}>
            <form onSubmit={submitHandler}>
                <div className={pageHeaderCN}>
                    <div className={actionButtonsBlockCN}>
                        {!showRestoreButton && (
                            <>
                                <Button
                                    onClick={deleteHandler}
                                    className={actionButtonCN}
                                    disabled={deleteButtonDisabled}
                                    caption='Удалить'
                                    size='small'
                                    type='button'
                                />
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
                </div>
                <div className={pageContentCN}>
                    <EventTitleEditor
                        useTitle={CONTROLLER.useEventTitle}
                        eventType={eventType}
                        disabled={readonly}
                    />
                    {eventType === EventType.Project ? 
                    <EventSectionEditor
                        useSection={CONTROLLER.useEventSection}
                    />
                    : <></>}
                    {spoilerUnits.map((spoilerItem, index) => (
                        <section aria-label='Блок редактирования'>
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
                        </section>
                    ))}
                </div>
            </form>
        </EditingScreenFormContext.Provider>
        </div>
    );
}

export default EventEditingScreen;
