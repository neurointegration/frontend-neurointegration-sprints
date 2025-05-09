import React, { useEffect, useState } from 'react';
import './SettingsStyle.css';
import TextInput from '../../../Platform/_inputs/TextInput';
import Sidebar from '../../components/_sidebar/Sidebar';
import clsx from 'clsx';
import Button from '../../../Platform/_buttons/Button';
import { useRecoilState, useSetRecoilState } from 'recoil';
import MeInformationAtom from '../../../core/atoms/me.atom';
import { API } from '../../../core/api/handles';
import RolesAtom from '../../../core/atoms/roles.atom';
import { MePutRequestType } from '../../../core/api/actions/me';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../../core/routing/routes';

const SettingsScreen: React.FC = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [about, setAbout] = useState('');
    const [role, setRole] = useState('client');
    const [trainer, setTrainer] = useState('');
    const [photo, setPhoto] = useState(null);
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

        const promises = [
            API.ME.PutMe(data),
            API.ME.SetTrainer(trainerData),
            API.ME.SetRoles(role === 'both'),
        ];

        Promise.all(promises).then(() => location.reload());
    };

    const setMeInfo = useSetRecoilState(MeInformationAtom);
    const [_, setIsTrainer] = useRecoilState(RolesAtom);

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
        API.ME.Roles().then((res) => {
            if (res.isSuccess) {
                const trainerRes = res.body.includes('Trainer')
                    ? { isTrainer: true }
                    : { isTrainer: false };
                setRole(() => (trainerRes.isTrainer ? 'both' : 'client'));
                setIsTrainer(() => trainerRes);
            } else {
                setIsTrainer(() => ({ isTrainer: false }));
                setRole(() => 'client');
            }
        });
    }, []);

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
                            src={photo || '/logo.svg'}
                            alt='Profile'
                            className='profile-picture'
                        />
                    </div>
                    <h2 className='section-title'>Личная информация</h2>
                    {/* <TextInput
                        useValue={[username, setUsername]}
                        disabled
                        className='controls-margin_bottom-m'
                    /> */}
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
                        caption='Пересмотреть онбординг'
                        className={clsx(
                            'controls-fontsize-m',
                            'controls-fontweight-medium'
                        )}
                        showMode='filled'
                        type='button'
                        onClick={() => navigate(Routes.Onboarding)}
                    />
                    <h2 className='section-title'>Роль</h2>
                    <div className='radio-group'>
                        <label className='radio-label'>
                            <input
                                type='radio'
                                name='role'
                                value='client'
                                checked={role === 'client'}
                                onChange={() => setRole(() => 'client')}
                            />{' '}
                            Только клиент
                        </label>
                        <label className='radio-label'>
                            <input
                                type='radio'
                                name='role'
                                value='both'
                                checked={role === 'both'}
                                onChange={() => setRole(() => 'both')}
                            />{' '}
                            И клиент, и тренер
                        </label>
                    </div>
                    <button type='submit' className='primary-button'>
                        Сохранить
                    </button>
                </form>
            </div>
        </>
    );
};

export default SettingsScreen;
