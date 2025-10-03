import { useState } from 'react'
import TopicSelection from './components/TopicSelection'
import QuizGenerator from './components/QuizGenerator'
import QuizQuestion from './components/QuizQuestion'
import QuizResults from './components/QuizResults'

function App() {
  const [currentScreen, setCurrentScreen] = useState('topic-selection')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [quizData, setQuizData] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
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
    setCurrentScreen('topic-selection')
    setSelectedTopic('')
    setQuizData([])
    setUserAnswers([])
    setCurrentQuestionIndex(0)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'topic-selection':
        return <TopicSelection onTopicSelect={handleTopicSelect} />
      
      case 'quiz-generator':
        return <QuizGenerator topic={selectedTopic} onQuizGenerated={handleQuizGenerated} />
      
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
            topic={selectedTopic} // Added this line
          />
        )
      
      default:
        return <TopicSelection onTopicSelect={handleTopicSelect} />
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {renderScreen()}
      </div>
    </div>
    </>
  )
}

export default App