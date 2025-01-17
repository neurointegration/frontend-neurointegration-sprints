import { useState } from 'react';
import './OnboardingStyle.css';

const images: string[] = [
    '/onboarding/onboarding0.png',
    '/onboarding/onboarding1.png',
    '/onboarding/onboarding2.png',
    '/onboarding/onboarding3.png',
    '/onboarding/onboarding4.png',
    '/onboarding/onboarding5.png',
    '/onboarding/onboarding6.png',
    '/onboarding/onboarding7.png',
    '/onboarding/onboarding8.png',
    '/onboarding/onboarding9.png',
];

const totalImages: number = images.length + 1;

function OnboardingScreen(): JSX.Element {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(1);
    const [role, setRole] = useState('client');

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex > 1) {
                return prevIndex - 1;
            }
            return prevIndex;
        });
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) => {
            if (prevIndex < totalImages) {
                return prevIndex + 1;
            }
            return prevIndex;
        });
    };

    const isLastScreen = currentImageIndex === totalImages;
    const buttonColorClass = isLastScreen ? 'button-black' : 'button-white';

    return (
        <div className='image-slider-container'>
            {!isLastScreen ? (
                <img
                    src={images[currentImageIndex - 1]}
                    alt={`Image ${currentImageIndex}`}
                    className='slider-image'
                />
            ) : (
                <div className='last-screen-content'>
                    <div className='last-screen-text'>
                        Перед началом работы необходимо выбрать роль
                    </div>
                    <h2 className='section-title'>Роль</h2>
                    <div className='radio-group'>
                        <label className='radio-label'>
                            <input
                                type='radio'
                                name='role'
                                value='client'
                                checked={role === 'client'}
                                onChange={() => setRole('client')}
                            />{' '}
                            Только клиент
                        </label>
                        <label className='radio-label'>
                            <input
                                type='radio'
                                name='role'
                                value='both'
                                checked={role === 'both'}
                                onChange={() => setRole('both')}
                            />{' '}
                            И клиент, и тренер
                        </label>
                    </div>
                    <button className='start-button'>Начать работу</button>
                </div>
            )}
            <div className={`controls`}>
                <button
                    className={`prev-button ${buttonColorClass} ${
                        currentImageIndex === 1 ? 'button-hidden' : ''
                    }`}
                    onClick={handlePrev}
                >
                    &lt;
                </button>
                <div
                    className={`counter ${
                        isLastScreen ? 'counter-last-screen' : ''
                    }`}
                >
                    {currentImageIndex} / {totalImages}
                </div>
                <button
                    className={`next-button ${buttonColorClass} ${
                        isLastScreen ? 'button-hidden' : ''
                    }`}
                    onClick={handleNext}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}

export default OnboardingScreen;
