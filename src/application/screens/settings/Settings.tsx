import React, { useState } from "react";
import "./Settings.css"; // Подключение CSS для стилей

const SettingsScreen: React.FC = () => {
  // Состояния для данных формы
  const [username, setUsername] = useState("@Maria_Lisachenko");
  const [fullName, setFullName] = useState("Мария Алексеевна Лисаченко");
  const [about, setAbout] = useState("");
  const [role, setRole] = useState("both");
  const [trainer, setTrainer] = useState("@Тренер");
  const [sprintWeeks, setSprintWeeks] = useState("4");

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      username,
      fullName,
      about,
      role,
      trainer,
      sprintWeeks
    };

    // TODO добавить запрос к бэку
  };

  return (
    <div className="settings-container">
      <form onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="profile-picture-container">
          <img src="/empty-avatar.jpg" alt="Profile" className="profile-picture" />
        </div>

        {/* Personal Information */}
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

        {/* Review Onboarding Button */}
        <button type="button" className="secondary-button">Пересмотреть онбординг</button>

        {/* Role Selection */}
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

        {/* Trainer Section */}
        <h2 className="section-title">Мой тренер</h2>
        <input
          type="text"
          value={trainer}
          disabled
          className="text-input disabled-input"
        />

        {/* Sprint Weeks Section */}
        <h2 className="section-title">Количество недель в спринте</h2>
        <select
          value={sprintWeeks}
          onChange={(e) => setSprintWeeks(e.target.value)}
          className="text-input"
        >
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        {/* Save Button */}
        <button type="submit" className="primary-button">Сохранить</button>
      </form>
    </div>
  );
};

export default SettingsScreen;
