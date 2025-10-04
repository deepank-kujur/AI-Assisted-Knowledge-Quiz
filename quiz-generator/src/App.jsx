import { useState, useEffect } from 'react'
import TopicSelection from './components/TopicSelection'
import QuizGenerator from './components/QuizGenerator'
import QuizQuestion from './components/QuizQuestion'
import QuizResults from './components/QuizResults'
import ThemeToggle from './components/ThemeToggle'

function App() {
  // Load initial state from localStorage
  const [currentScreen, setCurrentScreen] = useState(() => {
    const saved = localStorage.getItem('quizAppState');
    return saved ? JSON.parse(saved).currentScreen : 'topic-selection';
  });
  
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const saved = localStorage.getItem('quizAppState');
    return saved ? JSON.parse(saved).selectedTopic : '';
  });
  
  const [selectedDifficulty, setSelectedDifficulty] = useState(() => {
    const saved = localStorage.getItem('quizAppState');
    return saved ? JSON.parse(saved).selectedDifficulty : 'medium';
  });
  
  const [quizData, setQuizData] = useState(() => {
    const saved = localStorage.getItem('quizAppState');
    return saved ? JSON.parse(saved).quizData : [];
  });
  
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem('quizAppState');
    return saved ? JSON.parse(saved).userAnswers : [];
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const saved = localStorage.getItem('quizAppState');
    return saved ? JSON.parse(saved).currentQuestionIndex : 0;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      currentScreen,
      selectedTopic,
      selectedDifficulty,
      quizData,
      userAnswers,
      currentQuestionIndex
    };
    localStorage.setItem('quizAppState', JSON.stringify(state));
  }, [currentScreen, selectedTopic, selectedDifficulty, quizData, userAnswers, currentQuestionIndex]);

  // Update handleTopicSelect to accept both topic and difficulty
  const handleTopicSelect = (topic, difficulty = 'medium') => {
    setSelectedTopic(topic)
    setSelectedDifficulty(difficulty) // Store the selected difficulty
    setCurrentScreen('quiz-generator')
  }

  const handleQuizGenerated = (generatedQuiz) => {
    setQuizData(generatedQuiz)
    setUserAnswers(new Array(generatedQuiz.length).fill(null))
    setCurrentQuestionIndex(0)
    setCurrentScreen('quiz-questions')
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answer
    setUserAnswers(newAnswers)
  }

  const handleNavigation = (direction) => {
    if (direction === 'next' && currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleQuizComplete = () => {
    setCurrentScreen('quiz-results')
  }

  const handleRestart = () => {
    // Clear localStorage when restarting completely
    localStorage.removeItem('quizAppState');
    setCurrentScreen('topic-selection')
    setSelectedTopic('')
    setSelectedDifficulty('medium') // Reset difficulty
    setQuizData([])
    setUserAnswers([])
    setCurrentQuestionIndex(0)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'topic-selection':
        return (
          <TopicSelection 
            onTopicSelect={handleTopicSelect} 
            initialDifficulty={selectedDifficulty}
          />
        )
      
      case 'quiz-generator':
        return (
          <QuizGenerator 
            topic={selectedTopic} 
            difficulty={selectedDifficulty} // Pass difficulty to generator
            onQuizGenerated={handleQuizGenerated} 
          />
        )
      
      case 'quiz-questions':
        return (
          <QuizQuestion 
            questions={quizData} 
            currentIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            onAnswerSelect={handleAnswerSelect}
            onNavigate={handleNavigation}
            onComplete={handleQuizComplete}
          />
        )
      
      case 'quiz-results':
        return (
          <QuizResults 
            questions={quizData} 
            userAnswers={userAnswers} 
            onRestart={handleRestart}
            topic={selectedTopic}
            difficulty={selectedDifficulty} // Pass difficulty to results
          />
        )
      
      default:
        return <TopicSelection onTopicSelect={handleTopicSelect} />
    }
  }

  return (
    <>
      <ThemeToggle />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8 transition-colors duration-300">
        <div className="container mx-auto px-4">
          {renderScreen()}
        </div>
      </div>
    </>
  )
}

export default App