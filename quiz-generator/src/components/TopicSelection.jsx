import { useState } from 'react';

const defaultTopics = [
  'Wellness & Health',
  'Tech Trends', 
  'World History',
  'Sports',
  'Movies & Entertainment',
  'Science & Nature',
  'Art & Culture',
  'Business & Finance',
  'Psychology & Mind',
  'Geography & Travel',
  'Food & Cooking',
  'Music & Instruments'
];

export default function TopicSelection({ onTopicSelect }) {
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = {
    all: defaultTopics,
    science: ['Science & Nature', 'Tech Trends', 'Psychology & Mind'],
    arts: ['Art & Culture', 'Movies & Entertainment', 'Music & Instruments'],
    lifestyle: ['Wellness & Health', 'Sports', 'Food & Cooking'],
    knowledge: ['World History', 'Geography & Travel', 'Business & Finance']
  };

  const filteredTopics = activeCategory === 'all' 
    ? defaultTopics 
    : categories[activeCategory];

  const handleGenerateQuiz = async () => {
    if (customTopic.trim()) {
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      onTopicSelect(customTopic.trim());
      setIsGenerating(false);
    }
  };

  const handleTopicClick = async (topic) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    onTopicSelect(topic);
    setIsGenerating(false);
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white flex items-center justify-center p-4 relative overflow-hidden">      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gray-300 rounded-full blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute top-1/4 -right-8 w-16 h-16 bg-gray-400 rounded-full blur-xl opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gray-500 rounded-full blur-lg opacity-20 animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gray-200 rounded-full blur-xl opacity-25 animate-pulse delay-1000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-gray-200/60 relative z-10 my-4">
        
        {/* Header - Further reduced spacing */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <span className="text-2xl text-white">🧠</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-600 to-gray-900 rounded-2xl blur opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-3 multi-shadow">
            Knowledge Quest
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Discover your intellect through AI-crafted challenges
          </p>
        </div>

        {/* Category Filters - Even tighter spacing */}
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {Object.keys(categories).map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-300 border-2 ${
                activeCategory === category
                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-600 hover:bg-gray-50 hover:shadow-md'
              }`}
            >
              <span className="relative z-10 tracking-wide">
                {category}
              </span>
            </button>
          ))}
        </div>

        {/* Main Content Grid - Reduced gap */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* Predefined Topics Section - Further reduced height */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Curated Topics
              </h2>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium border border-gray-300">
                {filteredTopics.length} domains
              </span>
            </div>
            
            {/* Topics Grid - Smaller height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {filteredTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicClick(topic)}
                  disabled={isGenerating}
                  className="group relative p-3 text-left bg-white border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 font-medium group-hover:text-gray-900 transition-colors text-sm">
                      {topic}
                    </span>
                    <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Topic Section - Reduced padding */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border-2 border-gray-200 shadow-md">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center mx-auto mb-3 transform hover:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Create Your Quest
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Forge your own path with AI-powered challenges
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter your realm of interest..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm placeholder-gray-400 outline-none transition-all duration-300 focus:border-gray-600 focus:bg-white focus:shadow-md bg-gray-50/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerateQuiz()}
                  disabled={isGenerating}
                />
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={!customTopic.trim() || isGenerating}
                className={`
                  w-full p-3 rounded-lg font-semibold text-sm transition-all duration-300 relative overflow-hidden group
                  ${customTopic.trim() && !isGenerating
                    ? 'bg-gray-900 text-white hover:bg-black hover:shadow-lg hover:scale-105 cursor-pointer'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }
                  ${isGenerating ? 'animate-pulse' : ''}
                `}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Crafting Your Quest...</span>
                    </>
                  ) : (
                    <>
                      <span>Forge Custom Quest</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </span>
                
                {customTopic.trim() && !isGenerating && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
              </button>
            </div>

            {/* Feature Highlights - Reduced spacing */}
            <div className="mt-6 pt-4 border-t border-gray-300">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="space-y-1">
                  <div className="text-gray-900 font-semibold text-xs">Instant</div>
                  <div className="text-gray-500 text-xs">AI Generation</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-900 font-semibold text-xs">Adaptive</div>
                  <div className="text-gray-500 text-xs">Smart Questions</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-900 font-semibold text-xs">Infinite</div>
                  <div className="text-gray-500 text-xs">Topics Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Reduced spacing */}
        <div className="text-center mt-6 pt-4 border-t border-gray-300">
          <p className="text-gray-500 text-xs">
            Powered by Intelligence • Unlimited Exploration • Personalized Insight
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
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(180deg); }
          }
        `}
      </style>
    </div>
  );
}