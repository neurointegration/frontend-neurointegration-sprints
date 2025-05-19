import React, { useEffect, useState } from 'react';
import './SettingsStyle.css';
import TextInput from '../../../Platform/_inputs/TextInput';
import Sidebar from '../../components/_sidebar/Sidebar';
import clsx from 'clsx';
import Button from '../../../Platform/_buttons/Button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import MeInformationAtom from '../../../core/atoms/me.atom';
import { API } from '../../../core/api/handles';
import RolesAtom from '../../../core/atoms/roles.atom';
import { MePutRequestType, Onboarding } from '../../../core/api/actions/me';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../../core/routing/routes';
import { TELEGRAM_BOT_URL } from '../../../config';
import OnboardingAtom from '../../../core/atoms/onboarding.atom';

const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [about, setAbout] = useState('');
    const [role, setRole] = useState('client');
    const [trainer, setTrainer] = useState('');
    const [photo, setPhoto] = useState(null);
    const [isAddingTrainerError, setisAddingTrainerError] = useState(false);
    const [sprintWeeks, setSprintWeeks] = useState(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data: MePutRequestType = {
            firstName: fullName,
            aboutMe: about,
            sprintWeeksCount: sprintWeeks,
        };

        const trainerData = {
            trainerUsername: trainer.startsWith('@') ? trainer : `@${trainer}`,
        };

        API.ME.PutMe(data).then(() => location.reload());


        API.ME.SetTrainer(trainerData).then((res) => {
            if (res.isSuccess) {
                setisAddingTrainerError(false);
            }
            else {
                setisAddingTrainerError(true);
            }});
    };

    const setMeInfo = useSetRecoilState(MeInformationAtom);
    const setOnboarding = useSetRecoilState(OnboardingAtom);

    const onboardingDropHandler = () => {
        const onboardingNew : Onboarding = {
            clientsOnboarding: false, 
            editingOnboarding: false,
            projectOnboarding: false, 
            dateOnboarding: false,
        };
        const data: MePutRequestType = {
            onboarding: onboardingNew,
        };

        API.ME.PutMe(data).then(() => {
            setOnboarding(onboardingNew);
            navigate(Routes.Sprint);
        });
    };

    useEffect(() => {
        document.body.className = 'body-color-white';

        API.ME.Me().then((res) => {
            if (res.isSuccess) {
                setFullName(() => res.body.firstName);
                setAbout(() => res.body.aboutMe);
                setSprintWeeks(() => res.body.sprintWeeksCount);
                setMeInfo(() => res.body);
                setPhoto(() => res.body.photoUrl);
            }
        });
        API.ME.Trainer().then((res) => {
            if (res.isSuccess) {
                setTrainer(() => `@${res.body.username}`);
            }
        });
    }, []);

    const handleLinkClick = () => {
        window.open(TELEGRAM_BOT_URL, '_blank');
    };

    return (
        <>
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-xl'
                )}
            />
            <div className='settings-container'>
                <form onSubmit={handleSubmit}>
                    <div className='profile-picture-container'>
                        <img
                            aria-hidden
                            src={photo || '/logo.svg'}
                            alt='Profile'
                            className='profile-picture'
                        />
                    </div>
                    <h2 className='section-title'>Личная информация</h2>
                    <TextInput
                        useValue={[fullName, setFullName]}
                        placeholder='ФИО'
                        className='controls-margin_bottom-m'
                    />
                    <TextInput
                        useValue={[about, setAbout]}
                        placeholder='О себе'
                        multiline
                        className='controls-margin_bottom-m'
                    />
                    <Button
                        caption='Показать обучение снова'
                        className={clsx(
                            'controls-fontsize-m',
                            'controls-fontweight-medium'
                        )}
                        showMode='filled'
                        type='button'
                        onClick={onboardingDropHandler}
                    />
                    <h2 className='section-title'>
                        Количество недель в спринте
                    </h2>
                    <select
                        value={sprintWeeks}
                        onChange={(e) => setSprintWeeks(() => e.target.value)}
                        className='text-input'
                    >
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </select>
                    <h2 className='section-title'>Мой тренер</h2>
                    <div>
                    <TextInput
                        useValue={[trainer, setTrainer]}
                        className='controls-margin_bottom-m'
                    />
                    {isAddingTrainerError ? <p className='section-error-message'>Кажется, такого тренера не существует</p> : <></>}
                    </div>
                    <h2 className='section-title'>Телеграм-бот для прохождения спринтов</h2>
                    <Button
                        caption='Перейти в бота'
                        className={clsx(
                            'controls-fontsize-m',
                            'controls-fontweight-medium'
                        )}
                        showMode='filled'
                        type='button'
                        onClick={handleLinkClick}
                    />
                    <button type='submit' className='primary-button'>
                        Сохранить
                    </button>
                </form>
            </div>
        </>
    );
};

export default SettingsScreen;
