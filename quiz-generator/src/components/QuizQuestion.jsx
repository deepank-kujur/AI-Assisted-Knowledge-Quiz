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

  // Calculate progress
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200/60">
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gray-300 rounded-full blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 -right-8 w-16 h-16 bg-gray-400 rounded-full blur-xl opacity-20 animate-bounce"></div>
      </div>

      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200/60 relative z-10">
        
        {/* Header with Progress */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-xl text-white">🧠</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
            Knowledge Challenge
          </h1>
        </div>

        {/* Progress Section - Only Percentage Display */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium text-sm">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-bold text-gray-800 text-lg">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          {/* Progress bar removed - only showing percentage */}
        </div>

        {/* Question Card */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 leading-relaxed">
              {currentQuestion.question}
            </h2>
            
            {/* Options Grid */}
            <div className="grid gap-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={`group relative p-3 rounded-lg border transition-all duration-200 text-left ${
                    selectedOption === index 
                      ? 'border-gray-800 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold transition-all duration-200 ${
                      selectedOption === index 
                        ? 'bg-white border-white text-gray-900' 
                        : 'border-gray-400 text-gray-600 group-hover:border-gray-500'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-sm leading-relaxed flex-1">
                      {option}
                    </span>
                    {selectedOption === index && (
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
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

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => onNavigate('prev')}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              currentIndex === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </span>
          </button>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span className="font-medium">{currentIndex === questions.length - 1 ? 'Finish' : 'Next'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentIndex === questions.length - 1 ? "M5 13l4 4L19 7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pt-3 border-t border-gray-300">
          <p className="text-gray-500 text-xs">
            Take your time • Trust your instincts
          </p>
        </div>
      </div>
    </div>
  );
}