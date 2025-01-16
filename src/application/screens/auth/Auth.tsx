import { useEffect } from 'react';
import './AuthStyle.css';
import { LoginButton } from '@telegram-auth/react';

const AuthScreen = () => {

    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <p className="primary-text">Вход в Нейроспринт</p>
                <p className="secondary-text">Приложение работает вместе<br />
                    с Telegram-ботом, нужна<br />
                    авторизация</p>
                <LoginButton
                    botUsername="neurosprints_test_bot"
                    onAuthCallback={(data) => {
                        console.log(data);
                        // call your backend here to validate the data and sign in the user
                    }}
                />
            </div>
        </div>
    );
};

export default AuthScreen;