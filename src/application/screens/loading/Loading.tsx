import { useEffect } from 'react';
import './LoadingStyle.css';

const LOADING_TEXT = "Загрузка..."

const LoadingScreen = () => {

    useEffect(() => {
        document.body.className = 'body-color-white';
    }, []);

    return (
        <div className="loading-container">
            <div className="loading-wrapper">
                <img src="/empty-avatar.gif" className="rotating-image" />
                <p className="loading-text">{LOADING_TEXT}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;