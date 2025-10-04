# AI-Assisted Knowledge Quiz

An interactive quiz application that generates educational questions using AI and provides a seamless quiz experience with progress tracking and personalized feedback.

## Live Demo: [Add your live demo link here]
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

## 🛠️ Tech Stack
### Frontend
-**React** - Modern UI framework with hooks for state management

-**Tailwind CSS** - Utility-first CSS framework (via CDN)

-**JavaScript ES6+** - Modern JavaScript features

### AI Integration
-**Google Gemini AI API** - For generating quiz questions and feedback

-**JSON Response Handling** - Consistent data structure for AI responses

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
├── public/
│   └── index.html              # Main HTML file with Tailwind CDN
├── src/
│   ├── components/
│   │   ├── TopicSelection.jsx  # Topic selection screen
│   │   ├── QuizQuestion.jsx    # Individual question display
│   │   ├── QuizResults.jsx     # Results and feedback screen
│   │   └── QuizGenerator.jsx   # Main quiz component
│   ├── services/
│   │   └── aiService.js        # AI API integration service
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # React DOM rendering
│   └── index.css              # Additional styles
├── package.json
└── README.md
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
  topicSearch: `Generate exactly 5 multiple choice questions about "{topic}".

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON array with exactly 5 questions
2. Each question must have:
   - "question" (clear, specific question)
   - "options" (exactly 4 options as strings)
   - "correctAnswer" (number 0-3 for correct option index)
3. Questions should cover different aspects of {topic}
4. Make only one option clearly correct, others plausible but wrong
5. Do NOT include any explanations or additional text

STRICT JSON FORMAT:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]`,

  feedback: `Create personalized feedback for a quiz result.

Quiz Details:
- Topic: {topic}
- Score: {score} out of {totalQuestions}
- Percentage: {percentage}%

IMPORTANT: Return ONLY the feedback text, no JSON or additional formatting.

Make it:
- Encouraging and motivational
- Brief (under 60 words)
- Appropriate for the score level
- Include the score and topic
- Focus on improvement and learning`
};



## 🔮 Future Enhancements

Add more quiz topics and categories

Implement quiz difficulty levels

Add timer functionality for timed quizzes

Include social sharing of results

Add user accounts and progress tracking

Implement offline capability with cached questions

## 📱 Screenshots

Topic selection screen
<img width="1919" height="1012" alt="Screenshot 2025-10-03 180057" src="https://github.com/user-attachments/assets/88cb5aa9-5658-49b9-8966-e7d9a8ed0bb6" />

Quiz generating
<img width="1919" height="1023" alt="Screenshot 2025-10-03 180118" src="https://github.com/user-attachments/assets/3a068879-3e11-40b0-b0f8-a5d193837b5c" />

Quiz question interface with progress
<img width="1919" height="1017" alt="Screenshot 2025-10-03 180135" src="https://github.com/user-attachments/assets/8f4c4bd3-09e2-4834-8457-16f3d557870f" />
<img width="1919" height="1015" alt="Screenshot 2025-10-03 180225" src="https://github.com/user-attachments/assets/fb53e7b9-d4b2-443e-a92a-acd17473fe5a" />


Results screen with AI feedback
<img width="1919" height="1016" alt="Screenshot 2025-10-03 180259" src="https://github.com/user-attachments/assets/15f51933-1eb7-4461-b495-75b7266a9f2a" />


Mobile responsive views
