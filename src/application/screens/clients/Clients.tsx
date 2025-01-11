import React, { useEffect, useState } from 'react';
import './Clients.css';

interface Client {
  username: string;
  name: string;
  comment?: string;
}

interface ClientCardProps {
  client: Client;
  onCommentSubmit: (username: string, comment: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onCommentSubmit }) => {
  const { username, name, comment } = client;
  const [newComment, setNewComment] = useState(comment || '');
  const [isDirty, setIsDirty] = useState(false);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
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
        <textarea
          className="comment-input"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Добавить комментарий"
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
  );
};

export default ClientsScreen;
