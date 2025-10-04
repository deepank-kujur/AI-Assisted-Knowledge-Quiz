import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Configuration - Lower temperature for more consistent results
const GEMINI_CONFIG = {
  model: "gemini-2.5-flash", // Use gemini-pro for better reliability
  generationConfig: {
    temperature: 0.3, // Lower temperature for consistent results
    maxOutputTokens: 2000,
  },
};

// Cache to prevent multiple API calls for same topic
const questionCache = new Map();

// Enhanced prompt templates for difficulty-based generation
const PROMPT_TEMPLATES = {
  topicSearch: `Generate exactly 5 multiple choice questions about "{topic}" with {difficulty} difficulty.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON array with exactly 5 questions
2. Each question must have:
   - "question" (clear, specific question)
   - "options" (exactly 4 options as strings)
   - "correctAnswer" (number 0-3 for correct option index)
3. Questions should cover different aspects of {topic}
4. Make only one option clearly correct, others plausible but wrong
5. Do NOT include any explanations or additional text

DIFFICULTY GUIDELINES:
- Easy: Basic facts, definitions, straightforward concepts. Suitable for beginners.
- Medium: Applied knowledge, moderate complexity, requires some understanding.
- Hard: Advanced concepts, analytical thinking, detailed knowledge required.
- Mixed: Combine questions from all difficulty levels.

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
- Difficulty: {difficulty}

IMPORTANT: Return ONLY the feedback text, no JSON or additional formatting.

Make it:
- Encouraging and motivational
- Brief (under 60 words)
- Appropriate for the score level and difficulty
- Include the score, topic, and difficulty context
- Focus on improvement and learning`
};

// Difficulty configuration matching the frontend
const DIFFICULTY_CONFIG = {
  easy: {
    level: 'easy',
    label: 'Beginner',
    promptHint: 'basic and fundamental',
    description: 'Basic concepts, straightforward questions'
  },
  medium: {
    level: 'medium',
    label: 'Intermediate',
    promptHint: 'moderately challenging',
    description: 'Balanced mix of concepts'
  },
  hard: {
    level: 'hard',
    label: 'Expert',
    promptHint: 'advanced and challenging',
    description: 'Advanced and detailed questions'
  },
  mixed: {
    level: 'mixed',
    label: 'Mixed',
    promptHint: 'varied difficulty levels',
    description: 'Random difficulty levels'
  }
};

// Test function to check if Gemini API is working
export const testGeminiAPI = async () => {
  try {
    console.log('🧪 Testing Gemini API connection...');
    
    const model = genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.model,
      generationConfig: { temperature: 0.1, maxOutputTokens: 100 }
    });

    const result = await model.generateContent("Say 'API is working' in one word.");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API test response:', text);
    return true;
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    return false;
  }
};

export const generateQuizQuestions = async (topic, difficulty = 'medium') => {
  // Check cache first to prevent multiple calls - include difficulty in cache key
  const cacheKey = `${topic.toLowerCase().trim()}_${difficulty}`;
  if (questionCache.has(cacheKey)) {
    console.log('📦 Returning cached questions for:', topic, 'with difficulty:', difficulty);
    return questionCache.get(cacheKey);
  }

  const maxRetries = 2;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      console.log(`🔍 Generating questions for: "${topic}" with difficulty: "${difficulty}" (Attempt ${retryCount + 1})`);

      const model = genAI.getGenerativeModel({
        model: GEMINI_CONFIG.model,
        generationConfig: GEMINI_CONFIG.generationConfig
      });

      // Get difficulty label for the prompt
      const difficultyLabel = DIFFICULTY_CONFIG[difficulty]?.label || 'Medium';
      
      const prompt = PROMPT_TEMPLATES.topicSearch
        .replace(/{topic}/g, topic)
        .replace(/{difficulty}/g, difficultyLabel);
      
      console.log('📝 Prompt sent to AI with difficulty:', difficultyLabel);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      // Clean the response
      const cleanedResponse = cleanAIResponse(aiResponse);
      console.log('✅ Received and cleaned AI response');
      
      // Parse and validate the JSON response
      let questions;
      try {
        questions = JSON.parse(cleanedResponse);
        console.log('✅ Successfully parsed JSON');
      } catch (parseError) {
        console.error('❌ JSON parsing error:', parseError);
        throw new Error('AI returned invalid JSON format');
      }

      // Enhanced validation
      if (validateQuestions(questions)) {
        console.log('✅ Successfully generated AI questions for topic:', topic, 'with difficulty:', difficulty);
        
        // Add difficulty metadata to questions
        questions = questions.map(q => ({
          ...q,
          difficulty: difficulty // Add difficulty to each question
        }));
        
        // Cache the results
        questionCache.set(cacheKey, questions);
        return questions;
      } else {
        throw new Error('Generated questions failed validation');
      }

    } catch (error) {
      retryCount++;
      console.error(`❌ Attempt ${retryCount} failed:`, error.message);

      if (retryCount >= maxRetries) {
        console.error('🚨 All retry attempts failed, using fallback questions');
        const fallbackQuestions = getBasicFallbackQuestions(topic, difficulty);
        // Cache fallback results too
        questionCache.set(cacheKey, fallbackQuestions);
        return fallbackQuestions;
      }

      // Wait before retrying
      await new Promise(resolve => 
        setTimeout(resolve, 1000 * retryCount)
      );
    }
  }
};

export const generateFeedback = async (score, totalQuestions, topic, difficulty = 'medium') => {
  try {
    console.log('🔄 Generating AI feedback...', { score, totalQuestions, topic, difficulty });
    
    const model = genAI.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
      }
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const difficultyLabel = DIFFICULTY_CONFIG[difficulty]?.label || 'Medium';
    
    const prompt = PROMPT_TEMPLATES.feedback
      .replace(/{topic}/g, topic || 'the quiz')
      .replace(/{score}/g, score)
      .replace(/{totalQuestions}/g, totalQuestions)
      .replace(/{percentage}/g, percentage)
      .replace(/{difficulty}/g, difficultyLabel);

    console.log('📝 Feedback prompt sent with difficulty context');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text().trim();
    
    console.log('✅ AI Feedback generated:', feedback);
    
    // ✅ ADD THIS VALIDATION: Check if feedback is empty
    if (!feedback || feedback.length < 5) {
      console.log('⚠️ AI returned empty feedback, using fallback');
      return generateEnhancedFallbackFeedback(score, totalQuestions, topic, difficulty);
    }
    
    return feedback;

  } catch (error) {
    console.error('❌ AI feedback error:', error);
    console.log('🔄 Using fallback feedback');
    return generateEnhancedFallbackFeedback(score, totalQuestions, topic, difficulty);
  }
};

// Enhanced fallback feedback function with difficulty context
const generateEnhancedFallbackFeedback = (score, totalQuestions, topic, difficulty = 'medium') => {
  const percentage = (score / totalQuestions) * 100;
  const topicName = topic || 'this topic';
  //const difficultyLabel = DIFFICULTY_CONFIG[difficulty]?.label || 'Medium';
  
  const difficultyContext = {
    easy: "beginner",
    medium: "intermediate", 
    hard: "expert",
    mixed: "mixed"
  }[difficulty] || "intermediate";

  if (percentage === 0) {
    return `You scored ${score}/${totalQuestions} on ${difficultyContext} level ${topicName}. Don't worry - every expert was once a beginner! Use this as motivation to learn more and try again. You've got this! 💪`;
  } else if (percentage < 50) {
    return `You scored ${score}/${totalQuestions} on ${difficultyContext} level ${topicName}. Good effort! You're building your foundation. Review the material and you'll see great improvement in your next attempt! 📚`;
  } else if (percentage < 80) {
    return `You scored ${score}/${totalQuestions} on ${difficultyContext} level ${topicName}. Well done! You have a solid understanding. With a bit more practice, you'll master this topic completely! 🌟`;
  } else if (percentage < 100) {
    return `You scored ${score}/${totalQuestions} on ${difficultyContext} level ${topicName}. Excellent work! You're very knowledgeable about this topic. Keep up the great learning journey! 🎉`;
  } else {
    return `Perfect score! ${score}/${totalQuestions} on ${difficultyContext} level ${topicName}. Outstanding! You've completely mastered this ${difficultyContext} level. Consider challenging yourself with more advanced material! 🏆`;
  }
};

// Enhanced response cleaning function
const cleanAIResponse = (response) => {
  let cleaned = response.trim();
  
  // Remove markdown code blocks
  cleaned = cleaned.replace(/```json\n?/g, '');
  cleaned = cleaned.replace(/\n?```/g, '');
  cleaned = cleaned.replace(/```/g, '');
  
  // Extract JSON array if wrapped in other text
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  
  if (firstBracket !== -1 && lastBracket !== -1) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }
  
  // Remove trailing commas that might break JSON parsing
  cleaned = cleaned.replace(/,\s*\]/g, ']');
  cleaned = cleaned.replace(/,\s*\}\s*\]/g, '}]');
  
  return cleaned.trim();
};

// Simplified validation function
const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length !== 5) {
    return false;
  }

  for (const q of questions) {
    if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
        typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      return false;
    }
  }
  return true;
};

// Enhanced fallback data with difficulty variations
const getBasicFallbackQuestions = (topic, difficulty = 'medium') => {
  console.log('📋 Using fallback questions for:', topic, 'with difficulty:', difficulty);
  
  const BASE_FALLBACK = {
    'Wellness': [
      {
        question: "What is the recommended daily water intake for adults?",
        options: ["1-2 liters", "2-3 liters", "3-4 liters", "4-5 liters"],
        correctAnswer: 1
      },
      {
        question: "Which of these is NOT a stress management technique?",
        options: ["Meditation", "Deep breathing", "Procrastination", "Exercise"],
        correctAnswer: 2
      },
      {
        question: "How many hours of sleep do adults typically need?",
        options: ["4-5 hours", "5-6 hours", "7-9 hours", "10-12 hours"],
        correctAnswer: 2
      },
      {
        question: "Which vitamin is produced when skin is exposed to sunlight?",
        options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
        correctAnswer: 3
      },
      {
        question: "What is mindfulness?",
        options: [
          "Focusing on future goals",
          "Paying attention to present moment",
          "Remembering past experiences", 
          "Multitasking efficiently"
        ],
        correctAnswer: 1
      }
    ],
    'Tech Trends': [
      {
        question: "What does AI stand for in technology?",
        options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Interface", "Algorithmic Integration"],
        correctAnswer: 1
      },
      {
        question: "Which technology is primarily associated with Web3?",
        options: ["Cloud Computing", "Blockchain", "Virtual Reality", "5G Networks"],
        correctAnswer: 1
      },
      {
        question: "What is the main purpose of quantum computing?",
        options: [
          "Faster video rendering",
          "Solving complex problems traditional computers can't handle",
          "Better internet browsing",
          "Improved mobile gaming"
        ],
        correctAnswer: 1
      },
      {
        question: "Which company developed ChatGPT?",
        options: ["Google", "Microsoft", "OpenAI", "Meta"],
        correctAnswer: 2
      },
      {
        question: "What does IoT stand for?",
        options: [
          "Internet of Things",
          "Integration of Technology",
          "International Online Transfer",
          "Interactive Operating Terminal"
        ],
        correctAnswer: 0
      }
    ]
  };

  // Get base questions and add difficulty metadata
  let questions = BASE_FALLBACK[topic] || BASE_FALLBACK['Wellness'];
  
  // Add difficulty to each question
  questions = questions.map(q => ({
    ...q,
    difficulty: difficulty
  }));

  return questions;
};

// Clear cache function (optional - if you need to refresh questions)
export const clearQuestionCache = () => {
  questionCache.clear();
  console.log('🧹 Question cache cleared');
};

// Export difficulty config for use in components
export { DIFFICULTY_CONFIG };