import { useEffect } from 'react';
import './LoadingStyle.css';

const LOADING_TEXT = 'Загрузка...';

const LoadingScreen = ({ text }: { text?: string }) => {
    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    return (
        <div className='loading-container'>
            <div className='loading-wrapper'>
                <div className='rounded-image-container'>
                    <img aria-hidden src='/empty-avatar.gif' alt='Rounded Image' />
                </div>
                <p className='loading-text'>{text || LOADING_TEXT}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
