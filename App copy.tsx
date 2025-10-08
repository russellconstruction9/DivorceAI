
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import ReportPreview from './components/ReportPreview';
import EarlyAccess from './components/EarlyAccess';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-white text-brand-steel-700 font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <ReportPreview />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
};

export default App;
