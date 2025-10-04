import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Model configurations for different difficulty levels
const MODEL_CONFIG = {
  easy: {
    model: "gemini-2.0-flash", // Fast and reliable for basic questions
    generationConfig: {
      temperature: 0.2, // Low temperature for consistent, factual questions
      maxOutputTokens: 1500,
      topP: 0.8,
    }
  },
  medium: {
    model: "gemini-2.5-flash-lite", // Balanced model for moderate complexity
    generationConfig: {
      temperature: 0.4, // Slightly higher for more variety
      maxOutputTokens: 2000,
      topP: 0.85,
    }
  },
  hard: {
    model: "gemini-2.5-pro", // Pro model for complex questions
    generationConfig: {
      temperature: 0.3, // Balanced for complex but consistent questions
      maxOutputTokens: 2500,
      topP: 0.9,
    }
  },
  mixed: {
    model: "gemini-2.5-flash", // Flash for mixed (covers all levels)
    generationConfig: {
      temperature: 0.5, // Higher for variety across difficulties
      maxOutputTokens: 2200,
      topP: 0.9,
    }
  },
  // Fallback configuration
  default: {
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000,
    }
  }
};

// Cache to prevent multiple API calls for same topic
const questionCache = new Map();

// Enhanced prompt templates for difficulty-based generation
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

// Enhanced difficulty configuration with model-specific prompts
const DIFFICULTY_CONFIG = {
  easy: {
    level: 'easy',
    label: 'Beginner',
    model: MODEL_CONFIG.easy.model,
    description: 'Basic concepts, straightforward questions',
    guidelines: `EASY LEVEL (Beginner):
- Focus on basic facts, definitions, and fundamental concepts
- Questions should be straightforward with clear correct answers
- Use simple language accessible to beginners
- Test recall of basic information
- Avoid complex scenarios or advanced terminology
- Example: "What is the capital of France?" rather than "What geopolitical factors influenced the selection of Paris as France's capital?"`
  },
  medium: {
    level: 'medium',
    label: 'Intermediate',
    model: MODEL_CONFIG.medium.model,
    description: 'Balanced mix of concepts',
    guidelines: `MEDIUM LEVEL (Intermediate):
- Include applied knowledge and practical scenarios
- Require some analysis or connection of concepts
- Mix factual recall with basic application
- Can include simple problem-solving
- Use moderately complex language
- Example: "Which programming paradigm is best suited for a banking application requiring high security and transaction integrity?"`
  },
  hard: {
    level: 'hard',
    label: 'Expert',
    model: MODEL_CONFIG.hard.model,
    description: 'Advanced and detailed questions',
    guidelines: `HARD LEVEL (Expert):
- Focus on advanced concepts and deep understanding
- Require analytical thinking and synthesis of information
- Include complex scenarios and nuanced distinctions
- Test ability to apply knowledge in unfamiliar contexts
- Use precise technical terminology where appropriate
- Example: "In quantum computing, how does superposition differ from entanglement in terms of information processing capabilities?"`
  },
  mixed: {
    level: 'mixed',
    label: 'Mixed',
    model: MODEL_CONFIG.mixed.model,
    description: 'Random difficulty levels',
    guidelines: `MIXED LEVEL (Varied):
- Create a balanced mix: 2 easy, 2 medium, 1 hard question
- Easy: Basic facts and definitions
- Medium: Applied knowledge and scenarios
- Hard: Complex analysis and advanced concepts
- Ensure clear progression in difficulty
- Label the difficulty in your mind but don't include it in output`
  }
};

// Get model configuration for specific difficulty
const getModelConfig = (difficulty) => {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const modelConfig = MODEL_CONFIG[difficulty] || MODEL_CONFIG.default;
  
  return {
    model: config.model,
    generationConfig: modelConfig.generationConfig
  };
};

// UPDATED: Ultra-robust JSON parsing function
const safeJsonParse = (jsonString) => {
  let cleaned = jsonString.trim();
  
  console.log('🔄 Attempting to parse JSON...');
  console.log('Raw response length:', cleaned.length);
  console.log('First 200 chars:', cleaned.substring(0, 200));

  // Check for empty response
  if (cleaned.length === 0) {
    throw new Error('Empty response from AI');
  }

  // Multiple parsing attempts with increasing levels of cleaning
  const parsingAttempts = [
    // Attempt 1: Direct parse
    () => {
      console.log('🔹 Attempt 1: Direct parse');
      return JSON.parse(cleaned);
    },
    
    // Attempt 2: Remove ALL markdown code blocks including backticks
    () => {
      console.log('🔹 Attempt 2: Remove ALL markdown');
      let attempt = cleaned
        // Remove all backtick-related markdown
        .replace(/^`*json\s*/gi, '') // Remove starting ```json
        .replace(/`*$/gi, '') // Remove ending ```
        .replace(/`/g, '') // Remove any remaining backticks
        .trim();
      
      // Try to find JSON array if response got corrupted
      const jsonMatch = attempt.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        attempt = jsonMatch[0];
      }
      return JSON.parse(attempt);
    },
    
    // Attempt 3: Extract JSON from malformed responses
    () => {
      console.log('🔹 Attempt 3: Extract JSON from text');
      
      // Handle the specific case where response starts with `json
      if (cleaned.startsWith('`') || cleaned.includes('`json')) {
        // Find the first { after any backticks
        const firstBrace = cleaned.indexOf('{');
        if (firstBrace !== -1) {
          // Find the last }
          const lastBrace = cleaned.lastIndexOf('}');
          if (lastBrace !== -1) {
            const jsonContent = cleaned.substring(firstBrace, lastBrace + 1);
            // Now try to extract complete JSON array
            const arrayMatch = jsonContent.match(/\[\s*{[\s\S]*?}\s*\]/);
            if (arrayMatch) {
              return JSON.parse(arrayMatch[0]);
            }
          }
        }
      }
      
      // General JSON extraction
      let attempt = cleaned
        // Remove ALL backticks first
        .replace(/`/g, '')
        // Fix common JSON issues
        .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/'/g, '"')
        .replace(/\\"/g, '"')
        .trim();
      
      return JSON.parse(attempt);
    },
    
    // Attempt 4: Manual reconstruction from question patterns
    () => {
      console.log('🔹 Attempt 4: Manual reconstruction');
      const questions = [];
      
      // Remove all backticks first
      const cleanText = cleaned.replace(/`/g, '');
      
      // More flexible regex to find question patterns
      const questionPatterns = [
        // Pattern 1: Standard JSON-like format
        /{\s*"question"\s*:\s*"([^"]*)"[^}]*"options"\s*:\s*\[([^\]]*)\][^}]*"correctAnswer"\s*:\s*(\d)/g,
        // Pattern 2: More flexible format
        /question["']?\s*:\s*["']([^"']*)["'][^}]*options["']?\s*:\s*\[([^\]]*)\][^}]*correctAnswer["']?\s*:\s*(\d)/gi,
        // Pattern 3: Even more flexible
        /"question":\s*"([^"]*)"[^}]*"options":\s*\[([^\]]*)\][^}]*"correctAnswer":\s*(\d)/g
      ];
      
      for (const pattern of questionPatterns) {
        let match;
        while ((match = pattern.exec(cleanText)) !== null && questions.length < 5) {
          try {
            const questionText = match[1].trim();
            const optionsText = match[2];
            const correctAnswer = parseInt(match[3]);
            
            // Parse options array more carefully
            const options = optionsText
              .split(/,\s*/)
              .map(opt => {
                // Remove quotes and trim
                let cleanedOpt = opt.trim().replace(/^["']|["']$/g, '');
                // Remove any trailing commas or brackets
                cleanedOpt = cleanedOpt.replace(/,\s*$/, '');
                return cleanedOpt;
              })
              .filter(opt => opt.length > 0 && !opt.includes(']') && !opt.includes('}'));
            
            if (questionText && 
                questionText.length > 10 && 
                options.length === 4 && 
                !isNaN(correctAnswer) && 
                correctAnswer >= 0 && 
                correctAnswer <= 3) {
              
              // Check if we already have this question
              const isDuplicate = questions.some(q => q.question === questionText);
              if (!isDuplicate) {
                questions.push({
                  question: questionText,
                  options: options,
                  correctAnswer: correctAnswer
                });
                console.log(`✅ Found question: ${questionText.substring(0, 50)}...`);
              }
            }
          } catch (e) {
            console.log('Skipping invalid question block');
            continue;
          }
        }
        
        if (questions.length >= 3) {
          console.log(`✅ Reconstructed ${questions.length} questions with pattern`);
          return questions;
        }
      }
      
      throw new Error('Not enough valid questions found');
    },
    
    // Attempt 5: Simple text extraction as last resort
    () => {
      console.log('🔹 Attempt 5: Simple text extraction');
      const questions = [];
      const lines = cleaned.replace(/`/g, '').split('\n');
      
      let currentQuestion = null;
      let inQuestionBlock = false;
      let optionsFound = 0;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Look for question indicator
        if (trimmed.includes('"question"') || trimmed.includes('question:')) {
          if (currentQuestion && currentQuestion.question && optionsFound === 4) {
            questions.push(currentQuestion);
          }
          currentQuestion = { question: '', options: [], correctAnswer: 0 };
          inQuestionBlock = true;
          optionsFound = 0;
          
          // Extract question text
          const questionMatch = trimmed.match(/(?:question["']?\s*:\s*["']?)([^"',}]*)/);
          if (questionMatch && questionMatch[1].trim().length > 10) {
            currentQuestion.question = questionMatch[1].trim();
          }
        }
        
        // Look for options
        else if (inQuestionBlock && (trimmed.includes('"options"') || trimmed.includes('options:'))) {
          const optionsMatch = trimmed.match(/\[([^\]]*)\]/);
          if (optionsMatch) {
            const options = optionsMatch[1]
              .split(',')
              .map(opt => opt.trim().replace(/^["']|["']$/g, ''))
              .filter(opt => opt.length > 0);
            
            if (options.length === 4) {
              currentQuestion.options = options;
              optionsFound = 4;
            }
          }
        }
        
        // Look for individual options
        else if (inQuestionBlock && optionsFound < 4 && trimmed.match(/^["']?[A-D][":]?\s*/)) {
          const optionText = trimmed.replace(/^["']?[A-D][":]?\s*/, '').replace(/["',]$/, '').trim();
          if (optionText && !currentQuestion.options.includes(optionText)) {
            currentQuestion.options.push(optionText);
            optionsFound++;
          }
        }
        
        // Look for correct answer
        else if (inQuestionBlock && (trimmed.includes('"correctAnswer"') || trimmed.includes('correctAnswer:'))) {
          const answerMatch = trimmed.match(/(?:correctAnswer["']?\s*:\s*)(\d)/);
          if (answerMatch) {
            currentQuestion.correctAnswer = parseInt(answerMatch[1]);
          }
        }
        
        // End of object or block
        else if (trimmed === '}' || trimmed === '],' || trimmed.includes('}')) {
          if (currentQuestion && currentQuestion.question && currentQuestion.options.length === 4) {
            questions.push(currentQuestion);
          }
          inQuestionBlock = false;
          currentQuestion = null;
          optionsFound = 0;
        }
      }
      
      // Don't forget the last question
      if (currentQuestion && currentQuestion.question && currentQuestion.options.length === 4) {
        questions.push(currentQuestion);
      }
      
      if (questions.length >= 2) { // Accept even 2 questions as last resort
        console.log(`✅ Reconstructed ${questions.length} questions via simple extraction`);
        return questions;
      }
      throw new Error('Not enough valid questions found');
    }
  ];

  // Try each parsing attempt
  for (let i = 0; i < parsingAttempts.length; i++) {
    try {
      const result = parsingAttempts[i]();
      if (result && Array.isArray(result) && result.length > 0) {
        console.log(`✅ Parse successful with attempt ${i + 1}`);
        return result;
      }
    } catch (error) {
      console.log(`❌ Attempt ${i + 1} failed:`, error.message);
      // Continue to next attempt
    }
  }
  
  throw new Error('All JSON parsing attempts failed');
};

// More flexible validation function
const validateQuestions = (questions) => {
  if (!Array.isArray(questions)) {
    console.error('❌ Validation failed: Not an array');
    return false;
  }

  if (questions.length < 3) { // Reduced from 5 to 3 for flexibility
    console.error(`❌ Validation failed: Only ${questions.length} questions, need at least 3`);
    return false;
  }

  let validCount = 0;
  for (const q of questions) {
    if (q.question && 
        typeof q.question === 'string' && 
        q.question.length > 10 &&
        Array.isArray(q.options) && 
        q.options.length === 4 &&
        typeof q.correctAnswer === 'number' && 
        q.correctAnswer >= 0 && 
        q.correctAnswer <= 3) {
      validCount++;
    }
  }

  if (validCount >= 3) { // Require at least 3 valid questions
    console.log(`✅ Validation passed: ${validCount}/${questions.length} questions are valid`);
    return true;
  }

  console.error(`❌ Validation failed: Only ${validCount} valid questions`);
  return false;
};

// Test function to check if Gemini API is working
export const testGeminiAPI = async () => {
  try {
    console.log('🧪 Testing Gemini API connection...');
    
    const model = genAI.getGenerativeModel({ 
      model: MODEL_CONFIG.default.model,
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
  let currentDifficulty = difficulty;

  // If expert level fails, we'll try intermediate as fallback
  let fallbackToIntermediate = false;

  while (retryCount < maxRetries) {
    try {
      console.log(`🔍 Generating questions for: "${topic}" with difficulty: "${currentDifficulty}" (Attempt ${retryCount + 1})`);

      // Get model configuration based on difficulty
      const modelConfig = getModelConfig(currentDifficulty);
      const difficultyConfig = DIFFICULTY_CONFIG[currentDifficulty] || DIFFICULTY_CONFIG.medium;
      
      console.log(`🎯 Using model: ${modelConfig.model} for ${currentDifficulty} difficulty`);

      const model = genAI.getGenerativeModel({
        model: modelConfig.model,
        generationConfig: modelConfig.generationConfig
      });

      // Get difficulty-specific prompt
      const prompt = PROMPT_TEMPLATES.topicSearch
        .replace(/{topic}/g, topic)
        .replace(/{difficulty}/g, difficultyConfig.label)
        .replace(/{difficultyGuidelines}/g, difficultyConfig.guidelines);
      
      console.log('📝 Prompt sent to AI with difficulty-specific guidelines');

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      console.log('📨 Raw AI response received, length:', aiResponse.length);

      // Check for empty response
      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error('Empty response from AI');
      }
      
      // Use safe JSON parsing
      let questions;
      try {
        questions = safeJsonParse(aiResponse);
      } catch (parseError) {
        console.error('❌ JSON parsing failed:', parseError);
        throw new Error(`JSON parsing error: ${parseError.message}`);
      }

      // Enhanced validation
      if (validateQuestions(questions)) {
        console.log('✅ Successfully generated AI questions for topic:', topic, 'with difficulty:', currentDifficulty);
        
        // Add difficulty metadata to questions
        questions = questions.map(q => ({
          ...q,
          difficulty: currentDifficulty,
          modelUsed: modelConfig.model,
          originalRequestedDifficulty: difficulty // Track what was originally requested
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

      // If expert level fails and we haven't tried intermediate yet, switch to intermediate
      if (difficulty === 'hard' && !fallbackToIntermediate && (error.message.includes('Empty response') || error.message.includes('JSON parsing') || error.message.includes('All JSON parsing attempts'))) {
        console.log('🔄 Expert level failed, falling back to intermediate level...');
        currentDifficulty = 'medium';
        fallbackToIntermediate = true;
        retryCount = 0; // Reset retry count for intermediate level
        continue; // Continue with intermediate level
      }

      if (retryCount >= maxRetries) {
        console.error('🚨 All retry attempts failed, using fallback questions');
        const fallbackQuestions = getBasicFallbackQuestions(topic, currentDifficulty);
        
        // Add metadata to fallback questions
        const enhancedFallbackQuestions = fallbackQuestions.map(q => ({
          ...q,
          originalRequestedDifficulty: difficulty,
          isFallback: true
        }));
        
        // Cache fallback results too
        questionCache.set(cacheKey, enhancedFallbackQuestions);
        return enhancedFallbackQuestions;
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
    
    // Use flash model for feedback (faster and cheaper)
    const model = genAI.getGenerativeModel({
      model: MODEL_CONFIG.easy.model, // Use flash model for feedback
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
    
    // Check if feedback is empty
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
    difficulty: difficulty,
    modelUsed: 'fallback' // Mark as fallback
  }));

  return questions;
};

// Clear cache function (optional - if you need to refresh questions)
export const clearQuestionCache = () => {
  questionCache.clear();
  console.log('🧹 Question cache cleared');
};

// Export difficulty config for use in components
export { DIFFICULTY_CONFIG, MODEL_CONFIG };