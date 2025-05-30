import { useEffect } from 'react';
import './AuthStyle.css';
import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import { API } from '../../../core/api/handles';
import { TelegramRequestDataType } from '../../../core/api/actions/auth';
import { HTTPErrorResponse } from '../../../core/api/utils/httpHandlers';
import { useSetRecoilState } from 'recoil';
import AuthAtom from '../../../core/atoms/auth.atom';
import { BOT_USERNAME, TELEGRAM_BOT_URL  } from '../../../config';

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
                <h1 className='primary-text'>Вход в Нейроспринт</h1>
                <p className='secondary-text'>
                    Важно! Приложение работает вместе с&nbsp;Телеграм-ботом.
                    <br />
                    Пожалуйста, перед началом работы проверьте, что вы зарегистрированы.
                    <br />
                    <a href={TELEGRAM_BOT_URL} target="_blank"
                        //style={{ color: 'blue', cursor: 'pointer' }}
                        //onClick={handleLinkClick}
                    >Телеграм-бот для прохождения спринтов нейроинтеграции
                    </a>
                </p>
                <LoginButton
                    botUsername={BOT_USERNAME}
                    onAuthCallback={authCallback}
                />
            </div>
        </div>
    );
};

export default AuthScreen;
