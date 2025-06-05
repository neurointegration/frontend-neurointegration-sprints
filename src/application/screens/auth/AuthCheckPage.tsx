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
import { useNavigate, useParams } from 'react-router-dom';
import { Routes } from '../../../core/routing/routes';

//const BOT_USERNAME = 'neurosprints_test_bot';
//const TELEGRAM_BOT_URL = 'https://t.me/neurointegration_help_bot';

//id=1798460719
// first_name=Мария
// last_name=Лисаченко
// username=Mariya_Lisachenko
// photo_url=https%3A%2F%2Ft.me%2Fi%2Fuserpic%2F320%2FttTzsezh5fiQVqtSuquziteQY4u13Rnu9Z6HHZRXYBU.jpg
// auth_date=1749140373&
// hash=38a01c51ff5665822c60546094a9ff6012888c1a7913cecded7d4e3306116678

const AuthCheckScreen = () => {
    // const { wait, loading } = useHttpLoader();
    const setAuthState = useSetRecoilState(AuthAtom);
    const navigate = useNavigate();
    const locationParams = useParams();
    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    useEffect(() => {
        const params: TelegramRequestDataType = {
            id: locationParams.id.toString(),
            firstName: locationParams.first_name,
            lastName: locationParams.last_name,
            userName: locationParams.username,
            photoUrl: locationParams.photo_url,
            authDate: locationParams.auth_date.toString(),
            hash: locationParams.hash,
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
                navigate(Routes.Base);
            } else {
                // TODO: неудачная авторизация через TG
                console.log(
                    `Не удалось вызвать API метод в колбэке виджета telegram! Сообщение: ${
                        (response as HTTPErrorResponse).message
                    }`
                );
            }
        });
    });


    return (
        <div className='auth-container'> 
        <h1>Эта страница проверяет, залогинились ли мы, и редиректит в нужное место</h1>
        </div>
    );
};

export default AuthCheckScreen;
