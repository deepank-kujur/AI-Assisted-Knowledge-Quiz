import { useState, useEffect } from 'react';
import { generateFeedback } from '../services/aiService';

export default function QuizResults({ questions, userAnswers, onRestart, topic, difficulty }) { // Added difficulty prop
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const score = userAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const percentage = Math.round((score / questions.length) * 100);

    // Animate percentage on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowResults(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (showResults) {
            let current = 0;
            const increment = percentage / 60; // Animate over ~1 second

            const timer = setInterval(() => {
                current += increment;
                if (current >= percentage) {
                    setAnimatedPercentage(percentage);
                    clearInterval(timer);
                } else {
                    setAnimatedPercentage(Math.floor(current));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [showResults, percentage]);

    useEffect(() => {
        generateAIFeedback();
    }, [score, questions.length, topic, difficulty]); // Added difficulty dependency

    const generateAIFeedback = async () => {
        try {
            setLoading(true);
            const aiFeedback = await generateFeedback(score, questions.length, topic || 'the quiz', difficulty || 'medium'); // Pass difficulty

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

    // Get difficulty color
    const getDifficultyColor = () => {
        const colorMap = {
            easy: 'emerald',
            medium: 'blue',
            hard: 'red',
            mixed: 'purple'
        };
        return colorMap[difficulty] || 'blue';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full blur-xl opacity-30 animate-pulse transition-colors duration-300"></div>
                <div className="absolute top-1/4 -right-8 w-16 h-16 bg-gray-400 dark:bg-gray-600 rounded-full blur-xl opacity-20 animate-bounce transition-colors duration-300"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gray-500 dark:bg-gray-500 rounded-full blur-lg opacity-20 animate-ping transition-colors duration-300"></div>
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

            <div className="w-full max-w-4xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl dark:shadow-gray-900/50 p-6 md:p-8 border border-gray-200/60 dark:border-gray-700/60 relative z-10 transition-all duration-500 transform hover:scale-[1.01]">

                {/* Header with Enhanced Animation */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500 transition-colors duration-300">
                                <span className="text-2xl text-white">📊</span>
                            </div>
                            <div className="absolute -inset-2 bg-gradient-to-r from-gray-600 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-2xl blur opacity-30 animate-pulse transition-colors duration-300"></div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent mb-3 multi-shadow transition-colors duration-300">
                        Quest Complete!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base transition-colors duration-300">
                        Your journey through <strong className="text-gray-800 dark:text-white">{displayTopic}</strong> has concluded
                    </p>

                    {/* Difficulty Badge */}
                    <div className="flex justify-center mt-2">
                        <div className={`inline-flex items-center bg-${getDifficultyColor()}-100 dark:bg-${getDifficultyColor()}-900/30 text-${getDifficultyColor()}-800 dark:text-${getDifficultyColor()}-300 px-3 py-1 rounded-full text-xs font-medium border border-${getDifficultyColor()}-300 dark:border-${getDifficultyColor()}-700 transition-colors duration-300`}>
                            <span className="w-1.5 h-1.5 bg-current rounded-full mr-2"></span>
                            {getDifficultyDisplay()} Level
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">

                    {/* Left Side - Score & AI Feedback */}
                    <div className="space-y-4">
                        {/* Animated Score Card */}
                        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-500 hover:shadow-md">
                            <div className="text-center">
                                <div className="text-4xl font-black text-gray-800 dark:text-white mb-2 transition-colors duration-300">
                                    {showResults ? score : '?'}<span className="text-xl text-gray-500 dark:text-gray-400">/{questions.length}</span>
                                </div>
                                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                                    {showResults ? `${animatedPercentage}%` : 'Calculating...'} Correct
                                </div>

                                {/* Enhanced Progress Bar */}
                                <div className="relative">
                                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">
                                        <span className="font-medium">Performance Score</span>
                                        <span className="font-bold">{showResults ? animatedPercentage : 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 shadow-inner overflow-hidden transition-colors duration-300">
                                        <div
                                            className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-blue-500 dark:via-blue-600 dark:to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out relative"
                                            style={{ width: `${showResults ? animatedPercentage : 0}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Feedback with Enhanced Animation */}
                        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-500 hover:shadow-md">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center transition-colors duration-300">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                                AI Analysis
                            </h3>

                            {loading ? (
                                <div className="flex items-center justify-center space-x-3 py-4">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce transition-colors duration-300"></div>
                                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">AI is analyzing your performance...</span>
                                </div>
                            ) : (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 transition-all duration-500 transform hover:scale-[1.02]">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm transition-colors duration-300">
                                        {feedback}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Question Review */}
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-500 hover:shadow-md">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center transition-colors duration-300">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                            Question Review
                        </h3>

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {questions.map((question, index) => {
                                const userAnswer = userAnswers[index];
                                const isCorrect = userAnswer === question.correctAnswer;

                                return (
                                    <div
                                        key={index}
                                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm"
                                    >
                                        <div className="flex items-start space-x-3 mb-3">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-300">Q{index + 1}</span>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm flex-1 transition-colors duration-300">{question.question}</p>
                                        </div>

                                        <div className="mb-2">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Your answer:</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                                                    } transition-colors duration-300`}>
                                                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 transition-colors duration-300">
                                                <span className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">
                                                    {userAnswer !== null ? question.options[userAnswer] : 'Not answered'}
                                                </span>
                                            </div>
                                        </div>

                                        {!isCorrect && (
                                            <div className="mt-3">
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block transition-colors duration-300">Correct answer:</span>
                                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800 transition-colors duration-300">
                                                    <span className="text-emerald-700 dark:text-emerald-300 text-sm transition-colors duration-300">
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

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Correct', value: score, color: 'emerald' },
                        { label: 'Incorrect', value: questions.length - score, color: 'rose' },
                        { label: 'Accuracy', value: `${percentage}%`, color: 'blue' },
                        { label: 'Total', value: questions.length, color: 'gray' }
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`text-xl font-black text-${stat.color}-600 dark:text-${stat.color}-400 transition-colors duration-300`}>
                                {stat.value}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Action Buttons */}
                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onRestart}
                        className="group flex-1 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 text-white py-3 rounded-xl font-semibold transition-all duration-500 hover:scale-105 hover:shadow-lg active:scale-95 relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Embark on New Quest</span>
                        </span>
                        <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>

                    <button
                        onClick={onRestart}
                        className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold border border-gray-300 dark:border-gray-600 transition-all duration-300 hover:shadow-md active:scale-95"
                    >
                        Return to Home
                    </button>
                </div>

                {/* Enhanced Footer */}
                <div className="text-center mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 transition-colors duration-300">
                    <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">
                        Topic: <span className="font-medium text-gray-700 dark:text-gray-300">{displayTopic}</span> •
                        Difficulty: <span className="font-medium text-gray-700 dark:text-gray-300">{getDifficultyDisplay()}</span> •
                        Powered by Intelligence • Ready for Your Next Challenge
                    </p>
                </div>
            </div>

            <style>
                {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f8fafc;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          @media (prefers-color-scheme: dark) {
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #374151;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #6b7280;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          }
          .multi-shadow {
            text-shadow: 
              2px 2px 0px rgba(75, 85, 99, 0.15),
              4px 4px 0px rgba(55, 65, 81, 0.1),
              6px 6px 0px rgba(31, 41, 55, 0.05);
            transition: all 0.4s ease;
          }
          .multi-shadow:hover {
            transform: translateY(-2px);
            text-shadow: 
              4px 4px 0px rgba(75, 85, 99, 0.2),
              8px 8px 0px rgba(55, 65, 81, 0.15),
              12px 12px 0px rgba(31, 41, 55, 0.1);
          }
          @media (prefers-color-scheme: dark) {
            .multi-shadow {
              text-shadow: 
                2px 2px 0px rgba(156, 163, 175, 0.15),
                4px 4px 0px rgba(156, 163, 175, 0.1),
                6px 6px 0px rgba(156, 163, 175, 0.05);
            }
            .multi-shadow:hover {
              text-shadow: 
                4px 4px 0px rgba(156, 163, 175, 0.2),
                8px 8px 0px rgba(156, 163, 175, 0.15),
                12px 12px 0px rgba(156, 163, 175, 0.1);
            }
          }
          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
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