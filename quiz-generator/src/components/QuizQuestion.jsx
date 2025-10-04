import { useState, useEffect } from 'react';

export default function QuizQuestion({ 
  questions, 
  currentIndex, 
  userAnswers, 
  onAnswerSelect, 
  onNavigate, 
  onComplete 
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Calculate progress - use immediate value without animation
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    setCurrentQuestion(questions[currentIndex]);
    setSelectedOption(userAnswers[currentIndex]);
  }, [currentIndex, userAnswers, questions]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    onAnswerSelect(currentIndex, optionIndex);
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      onComplete();
    } else {
      onNavigate('next');
    }
  };

  // Don't render until we have the current question stabilized
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 md:p-6 transition-colors duration-300">
        <div className="w-full max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl dark:shadow-gray-900/50 p-6 md:p-8 border border-gray-200/60 dark:border-gray-700/60 transition-colors duration-300">
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-gray-800 dark:border-gray-200 border-t-transparent rounded-full animate-spin transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 md:p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full blur-xl opacity-30 animate-pulse transition-colors duration-300"></div>
        <div className="absolute top-1/4 -right-8 w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full blur-xl opacity-20 animate-bounce transition-colors duration-300"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-gray-500 dark:bg-gray-500 rounded-full blur-lg opacity-20 animate-ping transition-colors duration-300"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full opacity-20 transition-colors duration-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl dark:shadow-gray-900/50 p-6 md:p-8 border border-gray-200/60 dark:border-gray-700/60 relative z-10 transition-all duration-300">
        
        {/* Header with Progress - Only added pulse animation to icon */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105">
                <span className="text-xl text-white">🧠</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-600 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl blur opacity-30 animate-pulse transition-colors duration-300"></div>
            </div>
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent mb-2 transition-colors duration-300">
            Knowledge Challenge
          </h1>
        </div>

        {/* Progress Section - Removed animation delay */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium text-sm transition-colors duration-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-lg transition-colors duration-300">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          {/* Progress Bar - Removed animation delay */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner overflow-hidden transition-colors duration-300">
            <div 
              className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-blue-500 dark:to-purple-600 h-2 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Question Card - Added hover animation */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-300 hover:shadow-md">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-4 leading-relaxed transition-colors duration-300">
              {currentQuestion.question}
            </h2>
            
            {/* Options Grid - Added hover animations */}
            <div className="grid gap-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`group relative p-3 rounded-lg border transition-all duration-300 text-left transform hover:scale-[1.02] ${
                    selectedOption === index 
                      ? 'border-gray-800 bg-gray-800 dark:bg-gray-700 text-white shadow-md scale-[1.02]' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-gray-500 dark:hover:border-gray-400 hover:shadow-sm'
                  } transition-colors duration-300`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold transition-all duration-300 ${
                      selectedOption === index 
                        ? 'bg-white border-white text-gray-900' 
                        : 'border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-400 group-hover:border-gray-500 dark:group-hover:border-gray-400'
                    } transition-colors duration-300`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-sm leading-relaxed flex-1">
                      {option}
                    </span>
                    {selectedOption === index && (
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center transform scale-110 transition-transform duration-300">
                        <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation - Enhanced button animations */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => onNavigate('prev')}
            disabled={currentIndex === 0}
            className={`group px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              currentIndex === 0 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                : 'bg-gray-600 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 hover:scale-105 active:scale-95'
            } transition-colors duration-300`}
          >
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </span>
          </button>
          
          <button
            onClick={handleNext}
            className="group px-6 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg font-medium text-sm transition-all duration-300 hover:bg-gray-900 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span className="font-medium">{currentIndex === questions.length - 1 ? 'Finish' : 'Next'}</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentIndex === questions.length - 1 ? "M5 13l4 4L19 7" : "M9 5l7 7-7 7"} />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pt-3 border-t border-gray-300 dark:border-gray-600 transition-colors duration-300">
          <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">
            Take your time • Trust your instincts
          </p>
        </div>
      </div>

      <style>
        {`
          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(180deg); }
          }
        `}
      </style>
    </div>
  );
}