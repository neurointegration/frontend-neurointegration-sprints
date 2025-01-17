import { useEffect } from 'react';
import './AuthStyle.css';
import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import { API } from '../../../core/api/handles';
import { TelegramRequestDataType } from '../../../core/api/actions/auth';
import { HTTPErrorResponse } from '../../../core/api/utils/httpHandlers';
import { useSetRecoilState } from 'recoil';
import AuthAtom from '../../../core/atoms/auth.atom';
import useHttpLoader from '../../../core/api/hooks/useHttpLoader';

const BOT_USERNAME = 'neurosprints_test_bot';

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

    return (
        <div className='auth-container'>
            <div className='auth-wrapper'>
                <p className='primary-text'>Вход в Нейроспринт</p>
                <p className='secondary-text'>
                    Приложение работает вместе
                    <br />
                    с Telegram-ботом, нужна
                    <br />
                    авторизация
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
