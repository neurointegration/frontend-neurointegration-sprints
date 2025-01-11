// import all platform styles
import './Platform/Styles/colors.css';
import './Platform/Styles/fonts.css';
import './Platform/Styles/sizes.css';
import './Platform/Styles/offsets.css';
import './Platform/Styles/flex.css';
import './App.css';

// another imports
import HomeScreen from './application/screens/home/Home';
import EventEditingScreen from './application/screens/editing/EventEditing';

function App() {
    return (
        <div>
            <HomeScreen />
        </div>
    );
}

export default App;
