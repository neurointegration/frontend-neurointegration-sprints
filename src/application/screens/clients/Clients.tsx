import React, { SyntheticEvent, useEffect, useState } from 'react';
import './ClientsStyle.css';
import TextInput from '../../../Platform/_inputs/TextInput';
import Sidebar from '../../components/_sidebar/Sidebar';
import clsx from 'clsx';
import useHttpLoader from '../../../core/api/hooks/useHttpLoader';
import { API } from '../../../core/api/handles';
import { ClientResponseType } from '../../../core/api/actions/trainer.clients';
import { useNavigate } from 'react-router-dom';
import { path, Routes } from '../../../core/routing/routes';

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
            <div className='card-top' onClick={cardClickHandler}>
                <div className='profile-pic'></div>
                <div className='client-info'>
                    <p className='username'>@{username}</p>
                    <p className='name'>{firstName}</p>
                </div>
            </div>
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
    // Объект комментариев. Ключ - clientId, значение - текст комментария
    const [comments, setComments] = useState<{ [key: string]: string }>({});

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

    return (
        <>
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-xl'
                )}
            />
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
        </>
    );
};

export default ClientsScreen;
