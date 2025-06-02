import { useEffect, useState } from 'react';
import './AuthStyle.css';
import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import { API } from '../../../core/api/handles';
import { TelegramRequestDataType } from '../../../core/api/actions/auth';
import { HTTPErrorResponse } from '../../../core/api/utils/httpHandlers';
import { useSetRecoilState } from 'recoil';
import AuthAtom from '../../../core/atoms/auth.atom';
import { BOT_USERNAME, TELEGRAM_BOT_URL  } from '../../../config';
import clsx from 'clsx';
import Button from '../../../Platform/_buttons/Button';
import { OnboardingTypes } from '../../../core/api/actions/me';
import OnboardingCard, { OnboardingCardsForms } from '../../components/_cards/newOnboarding';

//const BOT_USERNAME = 'neurosprints_test_bot';
//const TELEGRAM_BOT_URL = 'https://t.me/neurointegration_help_bot';

const AuthScreen = () => {
    // const { wait, loading } = useHttpLoader();
    const setAuthState = useSetRecoilState(AuthAtom);
    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    const authCallback = (data: TelegramAuthData) => {
        const params: TelegramRequestDataType = {
            id: data.id.toString(),
            firstName: data.first_name,
            lastName: data.last_name,
            userName: data.username,
            photoUrl: data.photo_url,
            authDate: data.auth_date.toString(),
            hash: data.hash,
        };
        API.AUTH.Login(params).then((response) => {
            if (response.isSuccess) {
                setAuthState((prev) => ({
                    ...prev,
                    data: {
                        accessToken: response.body.data.accessToken,
                        refreshToken: response.body.data.refreshToken,
                    },
                }));

                localStorage.setItem(
                    'accessToken',
                    response.body.data.accessToken
                );
                localStorage.setItem(
                    'refreshToken',
                    response.body.data.refreshToken
                );

                location.reload();
                // navigate(Routes.Base);
            } else {
                // TODO: неудачная авторизация через TG
                console.log(
                    `Не удалось вызвать API метод в колбэке виджета telegram! Сообщение: ${
                        (response as HTTPErrorResponse).message
                    }`
                );
            }
        });
    };

    const handleLinkClick = () => {
        window.open(TELEGRAM_BOT_URL, '_blank');
    };


    return (
        <div className='auth-container'> 
            <div className='auth-wrapper'>
                <h1 className='primary-text-h1'>Вход в Нейроспринт</h1>
                <h2 className='primary-text-h2'>Инструкция по авторизации</h2>
                <div className='onboarding-container'>
                    <ol className='onboarding-list'>
                        <li>
                            <p className='secondary-text'>
                                Приложение работает вместе с&nbsp;Телеграм-ботом «Баланси».
                                <br />
                                Пожалуйста, перед началом работы проверьте, что вы зарегистрированы в&nbsp;«Баланси»: 
                                <a href={TELEGRAM_BOT_URL} target="_blank"
                                >Телеграм-бот для&nbsp;прохождения спринтов нейроинтеграции
                                </a>
                            </p>                    
                        </li>
                        <li>
                            <p className='secondary-text'>
                                К сожалению, на&nbsp;каждом новом устройстве авторизацию придётся проходить заново, таковы требования Телеграм.
                            </p> 
                        </li>
                        <li>
                            <p className='secondary-text'>
                                При&nbsp;авторизации потребуется указать номер телефона.                            
                                <br />
                                Мы не&nbsp;собираем данные о&nbsp;номерах телефона пользователей, это нужно только для&nbsp;авторизации в&nbsp;Телеграм.                            
                            </p> 
                        </li>
                        <li>
                            <p className='secondary-text'>
                                Дальше Телеграм пришлёт запрос на&nbsp;подтверждение авторизации. Его нужно принять.                           
                                <br />
                                Если приложение открыто во&nbsp;встроенном браузере Телеграм, то для&nbsp;корректной авторизации, пожалуйста, не&nbsp;закрывайте окно с&nbsp;приложением для&nbsp;принятия запроса, а&nbsp;просто сверните его.
                            </p> 
                        </li>
                    </ol>
                </div>
                <LoginButton
                    botUsername={BOT_USERNAME}
                    onAuthCallback={authCallback}
                />
            </div>
        </div>
    );
};

export default AuthScreen;
