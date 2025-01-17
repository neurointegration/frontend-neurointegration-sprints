import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EventEditingScreen from '../../application/screens/editing/EventEditing';
import Sprint from '../../application/screens/home/Sprint';
import { Routes as RoutesEnum } from './routes';
import SettingsScreen from '../../application/screens/settings/Settings';
import ClientsScreen from '../../application/screens/clients/Clients';
import OnboardingScreen from '../../application/screens/onboarding/Onboarding';

function AppRouter() {
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
                    path={RoutesEnum.Settings}
                    element={<SettingsScreen />}
                />
                <Route path={RoutesEnum.Clients} element={<ClientsScreen />} />
                <Route
                    path={RoutesEnum.Onboarding}
                    element={<OnboardingScreen />}
                />
                <Route
                    path={RoutesEnum.Creation}
                    element={<EventEditingScreen />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
