// import all platform styles
import './Platform/Styles/colors.css';
import './Platform/Styles/fonts.css';
import './Platform/Styles/sizes.css';
import './Platform/Styles/offsets.css';
import './Platform/Styles/flex.css';
import './App.css';

// another imports
import AuthProvider from './core/api/components/AuthProvider';
import { RecoilRoot } from 'recoil';
import AppRouter from './core/routing/AppRouter';

function App() {
    return (
        <RecoilRoot>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </RecoilRoot>
    );
}

export default App;
