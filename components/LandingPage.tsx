import React from 'react';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-6">
                        CustodyX<span className="text-teal-600">.AI</span>
                    </h1>
                    <p className="text-2xl text-gray-600 mb-8">
                        The Parent's Advantage in Family Court
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-lg text-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
