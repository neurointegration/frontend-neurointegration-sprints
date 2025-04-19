import { useEffect } from 'react';
import Sidebar from '../../components/_sidebar/Sidebar';
import clsx from 'clsx';

const ReflectionScreen = () => {
    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    return (
        <div className='reflection-container'>
            <Sidebar
                menuButtonClassName={clsx(
                    'controls-margin_top-s',
                    'controls-margin_left-3xl'
                )}
            />
            <p>Hello it's reflection screen</p>
        </div>
    );
};

export default ReflectionScreen;
