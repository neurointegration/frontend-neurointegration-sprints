import React, { useEffect, useState } from 'react';
import './ClientsStyle.css';
import TextInput from '../../../Platform/_inputs/TextInput';
import Sidebar from '../../components/_sidebar/Sidebar';
import clsx from 'clsx';

interface Client {
  username: string;
  name: string;
  comment?: string;
  about?: string;
}

interface ClientCardProps {
  client: Client;
  onCommentSubmit: (username: string, comment: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onCommentSubmit }) => {
  const { username, name, comment, about } = client;
  const [newComment, setNewComment] = useState(comment || '');
  const [isDirty, setIsDirty] = useState(false);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsDirty(e.target.value !== comment);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onCommentSubmit(username, newComment);
      setIsDirty(false);
    }
  };

  return (
    <div className="client-card">
      <div className="card-top">
        <div className="profile-pic"></div>
        <div className="client-info">
          <p className="username">@{username}</p>
          <p className="name">{name}</p>
        </div>
      </div>
      <div className="card-bottom">
        {about ? <p className="about">{about}</p> : null}
        <TextInput
          useValue={[newComment, setNewComment]}
          onChange={handleCommentChange}
          placeholder="Добавить комментарий"
          multiline
        />
        <button
          className="submit-button"
          onClick={handleCommentSubmit}
          disabled={!isDirty || !newComment.trim()}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

const ClientsScreen: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      username: 'vilgelminka_rumyanaya_malinka',
      name: 'Вильгельмина Васильевна Румянцева-Задунайская',
      about: 'О себе могу сказать что...'
    },
    {
      username: 'perepischitsa_voini_i_mira',
      name: 'Софья Андреевна Толстая',
      comment: 'Есть проблемы с качественным отдыхом. Нужно больше сосредоточиться на отключении от рабочих вопросов.',
    },
  ]);

  useEffect(() => {
    document.body.className = 'body-color-card-active-gray';
  }, []);

  const handleCommentSubmit = (username: string, comment: string) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.username === username ? { ...client, comment } : client
      )
    );

    // TODO отправка запроса на бэк
  };

  return (
    <>
      <Sidebar
        menuButtonClassName={clsx(
          'controls-margin_top-s',
          'controls-margin_left-xl'
        )}
      />
      <div className="clients-container">
        <div className="client-list">
          {clients.map(client => (
            <ClientCard
              key={client.username}
              client={client}
              onCommentSubmit={handleCommentSubmit}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientsScreen;
