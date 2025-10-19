import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPreview({ pitch }) {
  const navigate = useNavigate();

  if (!pitch || !pitch.startupName) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-xl text-center">
          <h3 className="text-xl font-bold text-red-400">Invalid Preview Data</h3>
          <p className="text-gray-400 mt-2 mb-4">Unable to load preview content.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Dynamically generate background image URL based on startup type
  const bgImage = `https://source.unsplash.com/1600x900/?${pitch.startupName.replace(' ', ',')},startup`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8">
        {/* Preview Header with Close Button */}
        <div className="fixed top-0 left-0 right-0 bg-gray-900/95 border-b border-gray-800 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-indigo-400">Landing Page Preview</h3>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
          >
            Close
          </button>
        </div>

        {/* Landing Page Content */}
        <div className="max-w-6xl mx-auto mt-20 bg-gray-900 rounded-2xl overflow-hidden">
          {/* Hero Section */}
          <div 
            className="relative h-[500px] flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
            <div className="relative z-10 text-center px-6">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                {pitch.startupName}
              </h1>
              <p className="text-2xl text-gray-200 mb-8">{pitch.tagline}</p>
              <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-xl hover:shadow-indigo-500/20 transition-all">
                Get Started
              </button>
            </div>
          </div>

          {/* Problems Section */}
          <div className="px-8 py-16 bg-gray-900">
            <h2 className="text-3xl font-bold text-center mb-12 text-indigo-400">
              Problems We Solve
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pitch.problems?.map((problem, index) => (
                <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-semibold mb-3 text-indigo-300">
                    {problem.title}
                  </h3>
                  <p className="text-gray-300">{problem.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions Section */}
          <div className="px-8 py-16 bg-gray-800/50">
            <h2 className="text-3xl font-bold text-center mb-12 text-indigo-400">
              Our Solution
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pitch.solutions?.map((solution, index) => (
                <div key={index} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-semibold mb-3 text-indigo-300">
                    {solution.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <span className="text-indigo-400 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-8 py-16 text-center bg-gradient-to-b from-gray-900 to-black">
            <h2 className="text-3xl font-bold mb-6">{pitch.heroCopy}</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Perfect for {pitch.targetAudience}
            </p>
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-xl hover:shadow-indigo-500/20 transition-all">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPreview;