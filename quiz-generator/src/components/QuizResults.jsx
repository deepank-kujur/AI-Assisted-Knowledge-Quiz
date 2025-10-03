import { useState, useEffect } from 'react';
import { generateFeedback } from '../services/aiService';

export default function QuizResults({ questions, userAnswers, onRestart, topic }) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  const score = userAnswers.reduce((acc, answer, index) => {
    return acc + (answer === questions[index].correctAnswer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  // Debug: Check what topic value we're receiving
  useEffect(() => {
    console.log('Topic received:', topic);
  }, [topic]);

  useEffect(() => {
    generateAIFeedback();
  }, [score, questions.length, topic]);

  const generateAIFeedback = async () => {
    try {
      setLoading(true);
      const aiFeedback = await generateFeedback(score, questions.length, topic || 'the quiz');
      
      if (aiFeedback && aiFeedback.trim().length > 0) {
        setFeedback(aiFeedback);
      } else {
        throw new Error('Empty feedback received');
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      const fallback = `You scored ${score}/${questions.length}. ${score === 0 ? 
        "Don't worry! Every expert was once a beginner!" : 
        "Good effort! Review and try again for better results."}`;
      setFeedback(fallback);
    } finally {
      setLoading(false);
    }
  };

  // Better topic handling
  const displayTopic = topic && topic !== 'undefined' && topic !== 'null' ? topic : 'General Knowledge';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6">
        
        {/* Header - Reduced spacing */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="text-xl text-white">📊</span>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Quiz Results
          </h1>
          <p className="text-slate-600 text-sm">
            Your performance in <strong className="text-slate-800">{displayTopic}</strong>
          </p>
        </div>

        {/* Main Content - Reduced gap */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Left Side - AI Feedback */}
          <div className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {score}<span className="text-lg text-slate-500">/{questions.length}</span>
                </div>
                <div className="text-base font-semibold text-slate-700">
                  {percentage}% Correct
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-slate-600 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                AI Analysis
              </h3>
              
              {loading ? (
                <div className="flex items-center justify-center space-x-2 py-3">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-slate-600 text-xs">Analyzing your performance...</span>
                </div>
              ) : (
                <div className="bg-blue-50 rounded p-3 border border-blue-200">
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {feedback}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Question Review */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
              Question Review
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={index} className="border border-slate-200 rounded p-3">
                    <div className="flex items-start space-x-2 mb-2">
                      <span className="text-xs font-medium text-slate-500 mt-0.5">Q{index + 1}</span>
                      <p className="text-slate-700 text-xs flex-1">{question.question}</p>
                    </div>

                    <div className="mb-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-slate-500">Your answer:</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded p-1.5 border border-slate-200">
                        <span className="text-slate-700 text-xs">
                          {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                        </span>
                      </div>
                    </div>

                    {!isCorrect && (
                      <div>
                        <span className="text-xs font-medium text-slate-500 mb-1 block">Correct answer:</span>
                        <div className="bg-emerald-50 rounded p-1.5 border border-emerald-200">
                          <span className="text-emerald-700 text-xs">
                            {question.options[question.correctAnswer]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats - Reduced spacing */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-slate-50 rounded border border-slate-200">
            <div className="text-base font-bold text-slate-800">{score}</div>
            <div className="text-xs text-slate-600">Correct</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded border border-slate-200">
            <div className="text-base font-bold text-slate-800">{questions.length - score}</div>
            <div className="text-xs text-slate-600">Incorrect</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded border border-slate-200">
            <div className="text-base font-bold text-slate-800">{percentage}%</div>
            <div className="text-xs text-slate-600">Accuracy</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded border border-slate-200">
            <div className="text-base font-bold text-slate-800">{questions.length}</div>
            <div className="text-xs text-slate-600">Total</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onRestart}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg font-semibold transition-colors duration-300 text-sm"
          >
            Take Another Quiz
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-semibold border border-slate-300 transition-colors duration-300 text-sm"
          >
            Back to Home
          </button>
        </div>

        {/* Footer - Reduced spacing */}
        <div className="text-center mt-4 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Topic: <span className="font-medium text-slate-700">{displayTopic}</span>
          </p>
        </div>
      </div>
    </div>
  );
}