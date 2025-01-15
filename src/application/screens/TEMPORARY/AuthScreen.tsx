import { SyntheticEvent, useState } from 'react';
import { API } from '../../../core/api/handles';
import useHttpLoader from '../../../core/api/hooks/useHttpLoader';
import { useSetRecoilState } from 'recoil';
import authAtom from '../../../core/atoms/auth.atom';

function TEMPAuthScreen() {
    const setAuthState = useSetRecoilState(authAtom);
    const { wait, loading } = useHttpLoader();
    const [email, setEmail] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const onSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        wait(API.AUTH.TestLogin({ email, password: pass }), (response) => {
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
            }
        });
    };

    return (
        <div>
            Авторизация посредством тестовых методов API
            <div>Логин: client, пароль: Client1!</div>
            <form
                style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '20px',
                    flexDirection: 'column',
                }}
                onSubmit={onSubmit}
            >
                <input
                    onChange={(e) => {
                        setEmail(() => e.target.value);
                    }}
                    value={email}
                    type='text'
                    placeholder='Имя пользователя (client)'
                />
                <input
                    value={pass}
                    onChange={(e) => {
                        setPass(() => e.target.value);
                    }}
                    type='text'
                    placeholder='Пароль (Client1!)'
                />
                <button>Логин</button>
            </form>
        </div>
    );
}

export default TEMPAuthScreen;
