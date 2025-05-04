import { PropsWithChildren, useEffect, useLayoutEffect } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { applyInterceptors } from '../utils/httpHandlers';
import useHttpLoader from '../hooks/useHttpLoader';
import AuthAtom from '../../atoms/auth.atom';
import { API } from '../handles';
import TEMPAuthScreen from '../../../application/screens/TEMPORARY/AuthScreen';
import RolesAtom from '../../atoms/roles.atom';
import MeInformationAtom from '../../atoms/me.atom';
import CurrentSprintAtom from '../../atoms/sprint.atom';
import HistorySprintsAtom from '../../atoms/historySprints.atom';
import LoadingScreen from '../../../application/screens/loading/Loading';
import AuthScreen from '../../../application/screens/auth/Auth';
import StandupSprintsAtom from '../../atoms/standup.atom';

const AuthProvider = (props: PropsWithChildren) => {
    const { wait, loading } = useHttpLoader();

    const [authState, setAuthState] = useRecoilState(AuthAtom);
    const resetAuthState = useResetRecoilState(AuthAtom);

    const setRolesState = useSetRecoilState(RolesAtom);
    const setMeInformationaState = useSetRecoilState(MeInformationAtom);
    const resetMeInformationState = useResetRecoilState(MeInformationAtom);

    const setCurrentSprintState = useSetRecoilState(CurrentSprintAtom);
    const setHistorySprintsState = useSetRecoilState(HistorySprintsAtom);
    const setStandupSprintsState = useSetRecoilState(StandupSprintsAtom);

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
                    if (resp.isSuccess) {
                        if (resp.body.length) {
                            // если есть хотя бы первый спринт - он основной, остальные - история
                            setCurrentSprintState(() => resp.body[0]);
                            setHistorySprintsState(() => resp.body.slice(1));
                            setStandupSprintsState(() => resp.body.slice(0))
                        }
                    } else {
                        return;
                    }
                });
            }
        });
    }, []);

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    if (!authState.data.accessToken || authState.data.accessToken === '') {
        return localStorage.getItem('isAutotest') ? (
            <TEMPAuthScreen />
        ) : (
            <AuthScreen />
        );
    }

    return <>{props.children}</>;
};

export default AuthProvider;
