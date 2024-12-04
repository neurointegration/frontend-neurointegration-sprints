// import all platform styles
import './Platform/Styles/colors.css';
import './Platform/Styles/fonts.css';
import './Platform/Styles/sizes.css';
import './Platform/Styles/offsets.css';
import './App.css';

// another imports
import HomeScreen from './application/screens/Home';

function App() {
    return (
        <div>
            <HomeScreen />
        </div>
    );
}

export default App;
