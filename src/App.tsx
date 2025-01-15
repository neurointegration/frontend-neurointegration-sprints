// import all platform styles
import './Platform/Styles/colors.css';
import './Platform/Styles/fonts.css';
import './Platform/Styles/sizes.css';
import './Platform/Styles/offsets.css';
import './Platform/Styles/flex.css';
import './App.css';

// another imports
import Sprint from './application/screens/home/Sprint';
import EventEditingScreen from './application/screens/editing/EventEditing';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Routes as RoutesEnum } from './core/routing/routes';
import AuthProvider from './core/api/components/AuthProvider';
import { RecoilRoot } from 'recoil';

function App() {
    return (
        <RecoilRoot>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path='/'
                            element={<Navigate to={RoutesEnum.Sprint} />}
                        />
                        <Route path={RoutesEnum.Sprint} element={<Sprint />} />
                        <Route
                            path={RoutesEnum.Editing}
                            element={<EventEditingScreen />}
                        />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </RecoilRoot>
    );
}

export default App;
