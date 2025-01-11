import React, { useState } from "react";
import "./Settings.css";

const SettingsScreen: React.FC = () => {
  const [username, setUsername] = useState("@Maria_Lisachenko");
  const [fullName, setFullName] = useState("Мария Алексеевна Лисаченко");
  const [about, setAbout] = useState("");
  const [role, setRole] = useState("both");
  const [trainer, setTrainer] = useState("@Тренер");
  const [sprintWeeks, setSprintWeeks] = useState("4");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { username, fullName, about, role, trainer, sprintWeeks };
    // TODO добавить запрос к бэку
  };

  return (
    <div className="settings-container">
      <form onSubmit={handleSubmit}>
        <div className="profile-picture-container">
          <img src="/empty-avatar.jpg" alt="Profile" className="profile-picture" />
        </div>
        <h2 className="section-title">Личная информация</h2>
        <input
          type="text"
          value={username}
          disabled
          className="text-input disabled-input"
        />
        <input
          type="text"
          placeholder="ФИО"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="text-input"
        />
        <textarea
          placeholder="О себе"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="text-input textarea"
        />
        <button type="button" className="secondary-button">Пересмотреть онбординг</button>
        <h2 className="section-title">Роль</h2>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="role"
              value="client"
              checked={role === 'client'}
              onChange={() => setRole('client')}
            /> Только клиент
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="role"
              value="both"
              checked={role === 'both'}
              onChange={() => setRole('both')}
            /> И клиент, и тренер
          </label>
        </div>
        <h2 className="section-title">Мой тренер</h2>
        <input
          type="text"
          value={trainer}
          disabled
          className="text-input disabled-input"
        />
        <h2 className="section-title">Количество недель в спринте</h2>
        <select
          value={sprintWeeks}
          onChange={(e) => setSprintWeeks(e.target.value)}
          className="text-input"
        >
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <button type="submit" className="primary-button">Сохранить</button>
      </form>
    </div>
  );
};

export default SettingsScreen;