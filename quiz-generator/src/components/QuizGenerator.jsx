import { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/aiService';

export default function QuizGenerator({ topic, difficulty, onQuizGenerated }) { // Added difficulty prop
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  

  const loadingSteps = [
    "Analyzing your topic...",
    "Researching content...", 
    "Crafting questions...",
    "Generating options...",
    "Finalizing quiz..."
  ];

  useEffect(() => {
    generateQuestions();
  }, [topic, difficulty]); // Added dependency on difficulty

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 12;
          if (newProgress >= 90) return 90;
          return newProgress;
        });
        
        // Update current step based on progress
        setCurrentStep(Math.floor((progress / 100) * loadingSteps.length));
      }, 400);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 800);
    }
    return () => clearInterval(interval);
  }, [loading, progress]);

  const generateQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      setCurrentStep(0);
      
      // Pass difficulty to the AI service
      const questions = await generateQuizQuestions(topic, difficulty);
      onQuizGenerated(questions);
    } catch (err) {
      setError('Failed to generate questions. Please try a different topic or try again.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    generateQuestions();
  };

  // Get difficulty display name
  const getDifficultyDisplay = () => {
    const difficultyMap = {
      easy: 'Beginner',
      medium: 'Intermediate',
      hard: 'Expert',
      mixed: 'Mixed'
    };
    return difficultyMap[difficulty] || 'Intermediate';
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-gray-900/50 p-6 md:p-8 border border-gray-200/60 dark:border-gray-700/60 relative overflow-hidden transition-colors duration-300">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-80 transition-colors duration-300"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-30 transition-colors duration-300"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gray-400 dark:bg-gray-600 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl opacity-20 transition-colors duration-300"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full opacity-20 transition-colors duration-300"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          {/* Header with Animated Icon */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500 transition-colors duration-300">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-gray-600 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl blur opacity-30 animate-pulse transition-colors duration-300"></div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent mb-3 transition-colors duration-300">
              Crafting Your Quest
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base mb-2 transition-colors duration-300">
              AI is designing your personalized challenge about
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
              <div className="inline-flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl font-semibold text-sm border border-gray-300 dark:border-gray-600 shadow-sm transition-colors duration-300">
                <span className="w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full mr-2 animate-pulse transition-colors duration-300"></span>
                {topic}
              </div>
              <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-2 rounded-xl font-medium text-xs border border-blue-300 dark:border-blue-700 shadow-sm transition-colors duration-300">
                <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mr-2 animate-pulse transition-colors duration-300"></span>
                {getDifficultyDisplay()} Level
              </div>
            </div>
          </div>

          {/* Enhanced Progress Section */}
          <div className="mb-6">
            {/* Progress Bar with Glow */}
            <div className="relative mb-4">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">
                <span className="font-medium">Generation Progress</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner overflow-hidden transition-colors duration-300">
                <div 
                  className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-blue-500 dark:via-blue-600 dark:to-purple-600 h-2 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Animated Loading Steps */}
            <div className="space-y-3">
              {loadingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 border ${
                    index <= currentStep
                      ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 transform scale-105 shadow-sm'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  } transition-colors duration-300`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                      index < currentStep
                        ? 'bg-gray-800 dark:bg-gray-600 text-white scale-110'
                        : index === currentStep
                        ? 'bg-gray-700 dark:bg-gray-500 text-white animate-pulse'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    } transition-colors duration-300`}>
                      {index < currentStep ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span className={`font-medium transition-colors duration-300 text-sm ${
                      index <= currentStep ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {index === currentStep && (
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-gray-700 dark:bg-gray-400 rounded-full animate-bounce transition-colors duration-300"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 transition-colors duration-300">
              <span className="text-gray-600 dark:text-gray-400">💡</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Generating {getDifficultyDisplay().toLowerCase()} level questions for {topic}
              </span>
            </div>
          </div>
        </div>

        <style>
          {`
            .animate-shimmer {
              animation: shimmer 1s ease-in-out infinite;
            }
            @keyframes shimmer {
              0% { transform: translateX(-100%) skewX(-12deg); }
              100% { transform: translateX(200%) skewX(-12deg); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(180deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-gray-900/50 p-6 md:p-8 border border-gray-200/60 dark:border-gray-700/60 relative overflow-hidden transition-colors duration-300">
        {/* Error Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 opacity-80 transition-colors duration-300"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gray-400 dark:bg-gray-600 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-30 transition-colors duration-300"></div>
        
        <div className="relative z-10">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500 transition-colors duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-2xl blur opacity-30 transition-colors duration-300"></div>
            </div>
          </div>

          {/* Error Content */}
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3 transition-colors duration-300">
              Generation Interrupted
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-sm transition-colors duration-300">
              {error}
            </p>

            {/* Show current settings */}
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-3 mb-4 border border-gray-300 dark:border-gray-600 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-sm">
                <div className="text-gray-700 dark:text-gray-300 font-medium">Current Settings:</div>
                <div className="flex gap-2">
                  <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs">{topic}</span>
                  <span className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-xs">{getDifficultyDisplay()}</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Retry Button */}
            <button
              onClick={handleRetry}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-800 text-white px-8 py-3 rounded-xl font-semibold text-base transition-all duration-500 hover:scale-105 hover:shadow-lg active:scale-95 mb-4 w-full transition-colors duration-300"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Try Again</span>
              </span>
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            {/* Enhanced Help Section */}
            <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-300 dark:border-gray-600 transition-colors duration-300">
              <div className="flex items-center justify-center mb-3">
                <span className="text-lg">💡</span>
                <h4 className="text-base font-semibold text-gray-800 dark:text-white ml-2 transition-colors duration-300">Quick Solutions</h4>
              </div>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-left text-sm transition-colors duration-300">
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <span className="text-gray-700 dark:text-gray-300 text-xs">1</span>
                  </div>
                  <span>Check your internet connection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <span className="text-gray-700 dark:text-gray-300 text-xs">2</span>
                  </div>
                  <span>Try a slightly different topic</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <span className="text-gray-700 dark:text-gray-300 text-xs">3</span>
                  </div>
                  <span>Wait a moment and retry</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <span className="text-gray-700 dark:text-gray-300 text-xs">4</span>
                  </div>
                  <span>Try a different difficulty level</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}