import React from 'react';
import Lottie from 'lottie-react';
import trainAnimation from '../assets/RP_Train_1.json'; // Import your Lottie JSON file

const LoadingScreen = () => {
    return (
        <div className="loading-screen-container">
            <Lottie
                animationData={trainAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default LoadingScreen;
