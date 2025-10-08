
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-brand-steel-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <p className="font-bold text-brand-blue-600 tracking-wide">CustodyX.AI — TRUTH. EVIDENCE. JUSTICE.</p>
            <h1 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-steel-900 leading-tight tracking-tighter">
              The Parent’s Advantage in Family Court
            </h1>
            <p className="mt-6 text-lg md:text-xl text-brand-steel-700 max-w-xl mx-auto md:mx-0">
              CustodyX.AI is an intelligent documentation and evidence system built to help parents protect their rights, their time, and their children. When the system feels stacked against you, CustodyX.AI helps you prove the truth — clearly, calmly, and credibly.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="https://russellconstruction9-8xf7.bolt.host/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Join Early Access →
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-brand-steel-200">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                 </div>
                 <div className="text-sm text-brand-steel-700 font-medium">Evidence Dashboard</div>
                 <div></div>
              </div>
              <div className="bg-brand-steel-100 rounded-lg p-4">
                <h3 className="font-bold text-brand-steel-800">Incident Log</h3>
                <p className="text-sm text-brand-steel-700 mt-1">November 2025</p>
                <div className="mt-4 space-y-3">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm text-brand-steel-800">Communication Violation</p>
                      <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Pattern Detected</span>
                    </div>
                     <p className="text-xs text-brand-steel-700 mt-1">November 15, 2025 - 8:10 PM</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm opacity-70">
                    <p className="font-semibold text-sm text-brand-steel-800">Missed Drop-off</p>
                     <p className="text-xs text-brand-steel-700 mt-1">November 12, 2025 - 6:05 PM</p>
                  </div>
                   <div className="bg-white p-3 rounded-md shadow-sm opacity-50">
                    <p className="font-semibold text-sm text-brand-steel-800">Parental Alienation Concern</p>
                     <p className="text-xs text-brand-steel-700 mt-1">November 8, 2025 - 11:45 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
