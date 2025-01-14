import { PropsWithChildren, useEffect, useLayoutEffect } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { applyInterceptors } from '../utils/httpHandlers';
import useHttpLoader from '../hooks/useHttpLoader';
import AuthAtom from '../../atoms/auth.atom';
import { API } from '../handles';
import TEMPAuthScreen from '../../../application/screens/TEMPORARY/AuthScreen';
import RolesAtom from '../../atoms/roles.atom';
import MeInformationAtom from '../../atoms/me.atom';
import CurrentSprintAtom from '../../atoms/sprint.atom';
import HistorySprintsAtom from '../../atoms/historySprints.atom';

const AuthProvider = (props: PropsWithChildren) => {
    const { wait, loading } = useHttpLoader();

    const [authState, setAuthState] = useRecoilState(AuthAtom);
    const resetAuthState = useResetRecoilState(AuthAtom);

    const setRolesState = useSetRecoilState(RolesAtom);
    const setMeInformationaState = useSetRecoilState(MeInformationAtom);
    const resetMeInformationState = useResetRecoilState(MeInformationAtom);
    const setCurrentSprintState = useSetRecoilState(CurrentSprintAtom);
    const setHistorySprintsState = useSetRecoilState(HistorySprintsAtom);

    useEffect(() => {
        applyInterceptors(authState, setAuthState, resetAuthState);
    }, []);

    // TODO: ОБРАБОТКА ОШИБОК ЗАПРОСОВ!
    useLayoutEffect(() => {
        wait(API.AUTH.Refresh(), (resp) => {
            if (resp.isSucceed) {
                setAuthState((prevState) => ({
                    ...prevState,
                    result: {
                        accessToken: resp.data.accessToken,
                        refreshToken: resp.data.refreshToken,
                    },
                }));
            }
        }).then(() => {
            wait(API.ME.Roles(), (resp) => {
                if (resp.isSuccess) {
                    if (resp.body.includes('Trainer')) {
                        setRolesState(() => ({ isTrainer: true }));
                    } else {
                        setRolesState(() => ({ isTrainer: false }));
                    }
                } else {
                    setRolesState(() => ({ isTrainer: false }));
                }
            });
            wait(API.ME.Me(), (resp) => {
                if (resp.isSuccess) {
                    setMeInformationaState(() => resp.body);
                } else {
                    resetMeInformationState();
                }
            });
            wait(API.SPRINTS.Sprints(), (resp) => {
                // TODO: атом состояния всех спринтов
                if (resp.isSuccess) {
                    if (resp.body.length) {
                        // если есть хотя бы первый спринт - он основной, остальные - история
                        setCurrentSprintState(() => resp.body[0]);
                        setHistorySprintsState(() => resp.body.slice(1));
                    }
                } else {
                    return;
                }
            });
        });
    }, []);

    if (loading) {
        return (
            // TODO: страница с крутящимся лоадером
            <div>ИДЕТ АВТОРИЗАЦИЯ... НЕ ЛЕЗЬ!</div>
            // <LoaderPage
            //     inscription={`Кажется, вы тут уже были...\nПытаемся авторизоваться...`}
            // />
        );
    }

    if (!authState.data.accessToken || authState.data.accessToken === '') {
        // TODO: здесь нужно вставить настоящую страницу авторизации!
        // return <Auth />;
        return <TEMPAuthScreen />;
    }

    return <>{props.children}</>;
};

export default AuthProvider;
