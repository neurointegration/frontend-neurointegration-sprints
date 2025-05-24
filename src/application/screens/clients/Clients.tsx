import React, { SyntheticEvent, useEffect, useState } from 'react';
import './ClientsStyle.css';
import '../../../Platform/_common-custom/EmptyListLabelStyle.css'
import '../../components/_cards/newOnboardingStyle.css';
import TextInput from '../../../Platform/_inputs/TextInput';
import Sidebar from '../../components/_sidebar/Sidebar';
import clsx from 'clsx';
import useHttpLoader from '../../../core/api/hooks/useHttpLoader';
import { API } from '../../../core/api/handles';
import { ClientResponseType } from '../../../core/api/actions/trainer.clients';
import { useNavigate } from 'react-router-dom';
import { path, Routes } from '../../../core/routing/routes';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { MePutRequestType, OnboardingTypes } from '../../../core/api/actions/me';
import MeInformationAtom from '../../../core/atoms/me.atom';
import OnboardingCard, { OnboardingCardsForms } from '../../components/_cards/newOnboarding';
import OnboardingAtom from '../../../core/atoms/onboarding.atom';
import '../../../Platform/Styles/accessibility.css'
import Delayed from '../../../core/api/utils/renderingDelayer';


type ClientCardProps = {
    comment: string;
    commentDisabled: boolean;
    clientRecord: ClientResponseType;
    onCommentSubmit: (userId: string, comment: string) => void;
};

const ClientCard: React.FC<ClientCardProps> = ({
    comment,
    commentDisabled,
    clientRecord,
    onCommentSubmit,
}) => {
    const navigate = useNavigate();
    const { username, firstName, aboutMe, id } = clientRecord;
    const [newComment, setNewComment] = useState(() => comment);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => setNewComment(() => comment), [comment]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.nativeEvent.stopImmediatePropagation();
        setIsDirty(() => e.target.value !== comment);
    };

    const handleCommentSubmit = (e: SyntheticEvent) => {
        e.nativeEvent.stopImmediatePropagation();
        onCommentSubmit(id, newComment);
        setIsDirty(false);
    };

    const cardClickHandler = () => {
        navigate(path(Routes.ClientSprint, { clientId: id }));
    };

    return (
        <div className='client-card'>
            <button className='card-top' onClick={cardClickHandler} aria-label={username + ' ' + firstName}>
                <div className='profile-pic'></div>
                <div className='client-info'>
                    <p aria-hidden className='username'>@{username}</p>
                    <p aria-hidden className='name'>{firstName}</p>
                </div>
            </button>
            <div className='card-bottom'>
                {aboutMe ? <p className='about'>{aboutMe}</p> : null}
                <>
                    <TextInput
                        useValue={[newComment, setNewComment]}
                        onChange={handleCommentChange}
                        placeholder='Добавить комментарий'
                        multiline
                        disabled={commentDisabled}
                    />
                    <button
                        className='submit-button'
                        onClick={handleCommentSubmit}
                        disabled={!isDirty}
                    >
                        Сохранить
                    </button>
                </>
            </div>
        </div>
    );
};

const ClientsScreen: React.FC = () => {
    const { wait, loading } = useHttpLoader();
    const [disableComments, setDisableComments] = useState(true);
    const [clients, setClients] = useState<ClientResponseType[]>([
        // {
        //     username: 'vilgelminka_rumyanaya_malinka',
        //     name: 'Вильгельмина Васильевна Румянцева-Задунайская',
        //     about: 'О себе могу сказать что...',
        // },
        // {
        //     username: 'perepischitsa_voini_i_mira',
        //     name: 'Софья Андреевна Толстая',
        //     comment:
        //         'Есть проблемы с качественным отдыхом. Нужно больше сосредоточиться на отключении от рабочих вопросов.',
        // },
    ]);

    const onboardingState = useRecoilValue(OnboardingAtom);
    const setOnboarding = useSetRecoilState(OnboardingAtom);

    // Объект комментариев. Ключ - clientId, значение - текст комментария
    const [comments, setComments] = useState<{ [key: string]: string }>({});
    const meInformation = useRecoilValue(MeInformationAtom);

    useEffect(() => {
        wait(API.TRAINER.CLIENTS.Clients(), (resp) => {
            if (resp.isSuccess) {
                const newClients = resp.body;
                const newComments = {};
                setClients(() => newClients);
                setComments(() => {
                    newClients.map((client) => {
                        newComments[client.id] = '';
                    });

                    return newComments;
                });

                const promises = newClients.map((client) => {
                    return API.TRAINER.COMMENTS.GetComment(client.id);
                });

                Promise.all(promises)
                    .then((commentsRes) => {
                        setComments((prev) => {
                            const newComments = { ...prev };

                            commentsRes.map((commentResp) => {
                                if (commentResp.isSuccess) {
                                    newComments[commentResp.body.userId] =
                                        commentResp.body.commentText;
                                }
                            });

                            return newComments;
                        });
                    })
                    .then(() => setDisableComments(() => false));
            }
        });
    }, []);

    useEffect(() => {
        document.body.className = 'body-color-card-active-gray';
    }, []);

    const handleCommentSubmit = (userId: string, comment: string) => {
        API.TRAINER.COMMENTS.EditComment(userId, comment).then((resp) => {
            if (resp.isSuccess) {
                setComments((prev) => {
                    return { ...prev, [userId]: comment };
                });
            }
        });
    };

    const onboardingCardClickHandler = () => {
        const onboardingNew = 
            {...onboardingState, clientsOnboarding: true};
        const data: MePutRequestType = {
            onboarding: onboardingNew,
        };

        API.ME.PutMe(data).then(() => {
            setOnboarding(onboardingNew)
        });
    };

    return (
        <>
            {!onboardingState.clientsOnboarding ? 
            <div className='onboarding-dark-overlay'/> :
        <></>}
            <h1 className='sr-only'>Список клиентов</h1>
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-xl'
                )}
            />
            <Delayed>
            {!onboardingState.clientsOnboarding ?  
            <OnboardingCard form={OnboardingCardsForms.Simple} type={OnboardingTypes.ClientsOnboarding} onboardingCardClickHandler={onboardingCardClickHandler}/>
            :
            <></>}
            </Delayed>
            {clients ? clients.length > 0 ? 
            <div className='clients-container'>
                <div className='client-list'>
                    {clients.map((client) => (
                        <ClientCard
                            key={client.id}
                            clientRecord={client}
                            comment={comments[client.id]}
                            commentDisabled={disableComments}
                            onCommentSubmit={handleCommentSubmit}
                        />
                    ))}
                </div>
            </div>
            : <h3 className='empty-list-label'>Кажется, клиенты ещё не указали в Telegram-боте вас своим тренером...</h3> : <h3 className='empty-list-label'>Кажется, клиенты ещё не указали в Telegram-боте вас своим тренером в боте...</h3>
            }
        </>
    );
};

export default ClientsScreen;
