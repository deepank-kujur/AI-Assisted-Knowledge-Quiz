# AI-Assisted Knowledge Quiz

An interactive quiz application that generates educational questions using AI and provides a seamless quiz experience with progress tracking and personalized feedback.

## Live Demo: https://ai-assisted-knowledge-quiz-5f5r.onrender.com
## Problem Statement:
Create an interactive knowledge quiz application that uses AI to generate quiz questions based on selected topics. The application should provide a smooth user experience with topic selection, question navigation, progress tracking, and AI-generated feedback upon completion.

## 🚀 Overview
This project is a frontend-focused React application that leverages AI APIs to dynamically generate quiz questions. It provides an engaging quiz experience with smooth navigation between questions, progress tracking, and personalized feedback based on user performance.

## Key Features
-**AI-Powered Question Generation**: Dynamic quiz questions generated based on user-selected topics

-**Interactive Quiz Interface**: Clean, modern UI with smooth navigation between questions

-**Progress Tracking**: Real-time progress indication throughout the quiz

-**Personalized Feedback**: AI-generated custom feedback based on quiz performance

-**Responsive Design**: Works seamlessly on desktop and mobile devices

-**Topic Selection**: Multiple knowledge domains to choose from

-**Multiple Difficulty Levels**: Easy, Medium, and Hard options to suit all knowledge levels

-**Theme Customization**: Toggle between Dark Mode and Light Mode for comfortable viewing

## 🛠️ Tech Stack
### Frontend
-**React** - Modern UI framework with hooks for state management

-**Tailwind CSS** - Utility-first CSS framework (via CDN)

-**JavaScript ES6+** - Modern JavaScript features

### AI Integration
-**Google Gemini AI API** - For generating quiz questions and feedback

-**JSON Response Handling** - Consistent data structure for AI responses

-**Dynamic Prompting** - Difficulty-aware question generation

## 📦 Installation & Setup
### Prerequisites
Node.js (v14 or higher)

npm or yarn package manager

Quick Start
bash
## Clone the repository
git clone [your-repository-url]
cd quiz-generator

### Install dependencies
npm install

### Start development server
npm run dev
The application will run locally at http://localhost:5173.

## 🚀 Usage
Topic Selection: Choose from various knowledge domains (Wellness, Tech Trends, etc.)

AI Question Generation: Watch as AI generates 5 unique multiple-choice questions

Interactive Quiz: Navigate through questions with next/previous buttons

Progress Tracking: See your progress in real-time

Personalized Results: Receive AI-generated feedback based on your score

## 🏗️ Project Structure
```bash
quiz-generator/
├── public/                 # Static assets
│   └── index.html
├── src/
│   ├── assets/            # Images, icons, and other static files
│   ├── components/        # React components
│   │   ├── QuizGenerator.jsx    # Main quiz orchestration component
│   │   ├── QuizQuestion.jsx     # Individual question display
│   │   ├── QuizResults.jsx      # Results and feedback screen
│   │   ├── ThemeToggle.jsx      # Dark/Light mode switch
│   │   └── TopicSelection.jsx   # Topic and difficulty selection
│   ├── context/           # React context providers
│   │   └── ThemeContext.jsx     # Theme management context
│   ├── services/          # External service integrations
│   │   └── aiService.js         # AI API integration service
│   ├── App.jsx            # Root application component
│   ├── main.jsx           # React DOM rendering entry point
│   └── index.css          # Global styles and Tailwind imports
├── env/                   # Environment variables
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```
## 🔧 Core Components
### TopicSelection.jsx
Displays available quiz topics

Handles topic selection and initiates AI question generation

Shows loading state during question generation

### QuizQuestion.jsx
Displays individual questions with multiple-choice options

Handles answer selection and navigation

Shows progress through the quiz

Maintains user selections across navigation

### QuizResults.jsx
Displays final score and performance summary

Shows AI-generated personalized feedback

Provides option to restart quiz

### aiService.js
Handles communication with AI API

Formats prompts for consistent JSON responses

Implements error handling and retry logic

Processes AI responses into quiz data structure

## 🎯 AI Integration
The application uses AI APIs with carefully crafted prompts to ensure consistent JSON output:

javascript
// Example AI prompt structure
const PROMPT_TEMPLATES = {
  topicSearch: `CRITICAL: You MUST return ONLY valid JSON. No other text.

Generate exactly 5 multiple choice questions about "{topic}" with {difficulty} difficulty.

REQUIREMENTS:
- Return ONLY a JSON array with exactly 5 objects
- Each object must have: "question", "options" (array of 4 strings), "correctAnswer" (number 0-3)
- Ensure JSON syntax is perfect: use double quotes, no trailing commas, proper brackets
- Make questions specific to the topic
- Make only one option clearly correct

DIFFICULTY-SPECIFIC GUIDELINES:
{difficultyGuidelines}

EXAMPLE FORMAT:
[
  {
    "question": "What is...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

NOW GENERATE FOR: "{topic}" at {difficulty} level. RETURN ONLY JSON:`,

  feedback: `Create personalized feedback for a quiz result.

Quiz Details:
- Topic: {topic}
- Score: {score} out of {totalQuestions}
- Percentage: {percentage}%
- Difficulty: {difficulty}

IMPORTANT: Return ONLY the feedback text, no JSON or additional formatting.

Make it:
- Encouraging and motivational
- Brief (under 60 words)
- Appropriate for the score level and difficulty
- Include the score, topic, and difficulty context
- Focus on improvement and learning`
};


## 🎨 Theme System
### Dark Mode Features
Dark background with light text for reduced eye strain

High contrast color scheme for better readability

Subtle shadows and depth effects

### Light Mode Features
Clean white background with dark text

Bright, energetic color palette

Optimized for daytime usage



## 🔮 Future Enhancements

Add more quiz topics and categories

Implement quiz difficulty levels

Add timer functionality for timed quizzes

Include social sharing of results

Add user accounts and progress tracking

Implement offline capability with cached questions

## 📱 Screenshots

### Topic selection screen
Dark mode:

<img width="1919" height="1019" alt="Screenshot 2025-10-04 162952" src="https://github.com/user-attachments/assets/4ee1aac3-f3ef-45b6-a3e8-4647a11e0856" />
light mode:

<img width="1919" height="1017" alt="Screenshot 2025-10-04 163012" src="https://github.com/user-attachments/assets/2784b4d6-2478-4f23-b019-cd72b8c5b102" />


### Quiz generating
<img width="1919" height="1018" alt="Screenshot 2025-10-04 163447" src="https://github.com/user-attachments/assets/35864c6a-28db-487d-8e66-218428f54e36" />

### Quiz question interface with progress
<img width="1919" height="1016" alt="Screenshot 2025-10-04 163538" src="https://github.com/user-attachments/assets/4705ecaa-b156-44e3-9771-a385deb200a7" />
<img width="1919" height="1017" alt="Screenshot 2025-10-04 163604" src="https://github.com/user-attachments/assets/67a351cc-2dd4-4ee8-8e2d-ce9eb327c734" />


### Results screen with AI feedback
<img width="1919" height="1019" alt="Screenshot 2025-10-04 163910" src="https://github.com/user-attachments/assets/3b9dcf49-2a43-4dd1-aecb-d9f24d88cc46" />



