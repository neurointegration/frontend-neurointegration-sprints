import clsx from 'clsx';
import { useEffect } from 'react';
import Sidebar from '../../components/_sidebar/Sidebar';
import './StandupStyle.css';
import StandupCard from '../../components/_cards/StandupCard';

const StandupScreen = () => {
    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    return (
        <div className='standup-container'>
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-3xl'
                )}
            />
            <StandupCard date={new Date}/>
            
        </div>
    );
};

export default StandupScreen;
