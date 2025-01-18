import EventEditingScreen from '../../application/screens/editing/EventEditing';
import OnboardingScreen from '../../application/screens/onboarding/Onboarding';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SettingsScreen from '../../application/screens/settings/Settings';
import HistoryScreen from '../../application/screens/history/History';
import ClientsScreen from '../../application/screens/clients/Clients';
import Sprint from '../../application/screens/home/Sprint';
import { Routes as RoutesEnum } from './routes';
import RolesAtom from '../atoms/roles.atom';
import PrivateRoute from './PrivateRoute';
import { useRecoilValue } from 'recoil';
import ClientSprintScreen from '../../application/screens/clients/ClientSprint';
import MeInformationAtom from '../atoms/me.atom';

function AppRouter() {
    const { isTrainer } = useRecoilValue(RolesAtom);
    const { isOnboardingComplete } = useRecoilValue(MeInformationAtom);
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={RoutesEnum.Base}
                    element={<Navigate to={RoutesEnum.Sprint} />}
                />
                <Route path={RoutesEnum.Sprint} element={<Sprint />} />
                <Route
                    path={RoutesEnum.Editing}
                    element={<EventEditingScreen />}
                />
                <Route
                    path={RoutesEnum.Creation}
                    element={<EventEditingScreen />}
                />
                <Route
                    path={RoutesEnum.Readonly}
                    element={<EventEditingScreen />}
                />
                <Route
                    path={RoutesEnum.Settings}
                    element={<SettingsScreen />}
                />
                <Route
                    path={RoutesEnum.Clients}
                    element={
                        <PrivateRoute access={isTrainer}>
                            <ClientsScreen />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={RoutesEnum.Onboarding}
                    element={<OnboardingScreen short={isOnboardingComplete} />}
                />
                <Route
                    path={RoutesEnum.OnboardingShort}
                    element={<OnboardingScreen short />}
                />
                <Route
                    path={RoutesEnum.ClientSprint}
                    element={<ClientSprintScreen />}
                />
                <Route path={RoutesEnum.History} element={<HistoryScreen />} />
                <Route path='*' element={<Sprint />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
