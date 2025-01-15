import React, { useState } from 'react';
import './OnboardingStyle.css';

const images: string[] = [
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding1.png',
];

const totalImages: number = images.length;

function OnboardingScreen(): JSX.Element {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(1);
    const [role, setRole] = useState("client");

    const handlePrev = () => {
        setCurrentImageIndex(prevIndex => {
            if (prevIndex > 1) {
                return prevIndex - 1;
            }
            return prevIndex;
        });
    };

    const handleNext = () => {
        setCurrentImageIndex(prevIndex => {
            if (prevIndex < totalImages) {
                return prevIndex + 1;
            }
            return prevIndex;
        });
    };

    const isLastScreen = currentImageIndex === totalImages;
    const buttonColorClass = isLastScreen ? 'button-black' : 'button-white';

    return (
        <div className="image-slider-container">
            {!isLastScreen ? (
                <img src={images[currentImageIndex - 1]} alt={`Image ${currentImageIndex}`} className="slider-image" />
            ) : (
                <div className="last-screen-content">
                    <div className="last-screen-text">Перед началом работы необходимо выбрать роль</div>
                    <h2 className="section-title">Роль</h2>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="role"
                                value="client"
                                checked={role === 'client'}
                                onChange={() => setRole('client')}
                            /> Только клиент
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="role"
                                value="both"
                                checked={role === 'both'}
                                onChange={() => setRole('both')}
                            /> И клиент, и тренер
                        </label>
                    </div>
                    <button className="start-button">Начать работу</button>
                </div>
            )}
            <div className={`controls ${isLastScreen ? 'center-controls' : ''}`}>
                {currentImageIndex > 1 && (
                    <button className={`prev-button ${buttonColorClass}`} onClick={handlePrev}>
                        &lt;
                    </button>
                )}
                <div className={`counter ${isLastScreen ? 'counter-last-screen' : ''}`}>
                    {currentImageIndex}/{totalImages}
                </div>
                {currentImageIndex < totalImages && (
                    <button className={`next-button ${buttonColorClass}`} onClick={handleNext}>
                        &gt;
                    </button>
                )}
            </div>
        </div>
    );
}

export default OnboardingScreen;