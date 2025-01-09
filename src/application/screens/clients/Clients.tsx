import React, { useState } from 'react';
import './Clients.css';

interface ClientCardProps {
  username: string;
  name: string;
  comment?: string;
  onCommentSubmit: (username: string, comment: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ username, name, comment, onCommentSubmit }) => {
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
  const [clients, setClients] = useState([
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

  const handleCommentSubmit = (username: string, comment: string) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.username === username ? { ...client, comment } : client
      )
    );

    // Simulate sending comment to backend
    console.log(`Comment submitted for ${username}: ${comment}`);
  };

  return (
    <div className="clients-container">
      <header className="header">Клиенты</header>
      <div className="client-list">
        {clients.map((client, index) => (
          <ClientCard
            key={index}
            username={client.username}
            name={client.name}
            comment={client.comment}
            onCommentSubmit={handleCommentSubmit}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientsScreen;
