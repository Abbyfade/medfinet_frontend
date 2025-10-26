import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Image, 
  FileText,
  Brain,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Volume2
} from 'lucide-react';
import elevenLabsApi from '../../services/elevenLabsApi';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: string[];
  suggestions?: string[];
  hasAudio?: boolean;
}

interface HealthInsight {
  id: string;
  type: 'vaccination_reminder' | 'health_tip' | 'risk_assessment' | 'appointment_suggestion';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
}

const AIHealthAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('pNInz6obpgDQGcFmaJgB'); // Default voice ID

  useEffect(() => {
    // Initialize with welcome message and health insights
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Health Assistant. I can help you with vaccination schedules, health recommendations, symptom analysis, and answer any healthcare questions you might have.',
      timestamp: new Date(),
      suggestions: [
        'Check vaccination schedule',
        'Analyze symptoms',
        'Find nearby clinics',
        'Health tips for children'
      ],
      hasAudio: true
    };

    const mockInsights: HealthInsight[] = [
      {
        id: '1',
        type: 'vaccination_reminder',
        title: 'Vaccination Due Soon',
        description: 'Jacob Williams is due for DTaP booster in 2 weeks',
        priority: 'high',
        actionable: true
      },
      {
        id: '2',
        type: 'health_tip',
        title: 'Seasonal Health Tip',
        description: 'Flu season is approaching. Consider scheduling flu vaccinations for your family.',
        priority: 'medium',
        actionable: true
      },
      {
        id: '3',
        type: 'risk_assessment',
        title: 'Health Risk Assessment',
        description: 'Based on recent data, your area has increased respiratory illness activity.',
        priority: 'medium',
        actionable: false
      }
    ];

    setMessages([welcomeMessage]);
    setHealthInsights(mockInsights);

    // Load available voices
    const loadVoices = async () => {
      try {
        // In a real implementation, this would call the Eleven Labs API
        const voicesData = elevenLabsApi.mock.getMockVoices();
        setAvailableVoices(voicesData.voices);
      } catch (error) {
        console.error('Error loading voices:', error);
      }
    };

    loadVoices();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): Message => {
    const responses = {
      vaccination: {
        content: 'Based on your child\'s age and vaccination history, here are the upcoming vaccines needed:\n\n• DTaP booster (due in 2 weeks)\n• Annual flu shot (recommended now)\n• MMR second dose (due in 3 months)\n\nWould you like me to help you schedule these appointments?',
        suggestions: ['Schedule appointments', 'Find nearby clinics', 'Learn about vaccines']
      },
      symptoms: {
        content: 'I can help analyze symptoms, but please remember this is not a substitute for professional medical advice. For serious symptoms, always consult a healthcare provider.\n\nWhat symptoms are you concerned about?',
        suggestions: ['Fever and cough', 'Skin rash', 'Digestive issues', 'Behavioral changes']
      },
      clinics: {
        content: 'I found 3 nearby pediatric clinics with good ratings:\n\n1. City Pediatrics - 0.5 miles away\n2. Metro Medical Center - 1.2 miles away\n3. Downtown Pediatric Clinic - 1.8 miles away\n\nWould you like more details about any of these?',
        suggestions: ['View clinic details', 'Check availability', 'Get directions']
      },
      default: {
        content: 'I\'m here to help with your healthcare questions. I can assist with vaccination schedules, symptom analysis, finding healthcare providers, and general health information. What would you like to know?',
        suggestions: ['Vaccination info', 'Symptom checker', 'Find clinics', 'Health tips']
      }
    };

    const lowerInput = userInput.toLowerCase();
    let response = responses.default;

    if (lowerInput.includes('vaccin') || lowerInput.includes('shot') || lowerInput.includes('immuniz')) {
      response = responses.vaccination;
    } else if (lowerInput.includes('symptom') || lowerInput.includes('sick') || lowerInput.includes('fever')) {
      response = responses.symptoms;
    } else if (lowerInput.includes('clinic') || lowerInput.includes('doctor') || lowerInput.includes('hospital')) {
      response = responses.clinics;
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
      hasAudio: true
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-error-200 bg-error-50 text-error-800';
      case 'medium': return 'border-warning-200 bg-warning-50 text-warning-800';
      case 'low': return 'border-success-200 bg-success-50 text-success-800';
      default: return 'border-neutral-200 bg-neutral-50 text-neutral-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'vaccination_reminder': return <Stethoscope className="h-5 w-5" />;
      case 'health_tip': return <Brain className="h-5 w-5" />;
      case 'risk_assessment': return <AlertTriangle className="h-5 w-5" />;
      case 'appointment_suggestion': return <Clock className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const handlePlayAudio = async (messageId: string, text: string) => {
    if (isPlayingAudio === messageId) {
      // Stop playing
      setIsPlayingAudio(null);
      return;
    }

    setIsPlayingAudio(messageId);

    try {
      // In a real implementation, this would call the Eleven Labs API
      const audioData = elevenLabsApi.mock.generateMockAudioUrl(text, selectedVoice);
      
      // Create audio element and play
      const audio = new Audio(audioData.audioUrl);
      
      audio.onended = () => {
        setIsPlayingAudio(null);
      };
      
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlayingAudio(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            AI Health Assistant
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Get personalized health insights and assistance powered by artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Insights Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Health Insights
                </h2>
              </div>
              
              <div className="space-y-4">
                {healthInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{insight.title}</h3>
                        <p className="text-sm opacity-90">{insight.description}</p>
                        {insight.actionable && (
                          <button className="mt-2 text-sm font-medium hover:underline">
                            Take Action →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Settings */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
              <div className="flex items-center mb-4">
                <Volume2 className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Voice Settings
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Select Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                  >
                    {availableVoices.map((voice) => (
                      <option key={voice.voice_id} value={voice.voice_id}>
                        {voice.name} ({voice.labels.gender})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    Click the speaker icon next to any assistant message to hear it read aloud.
                  </p>
                  <div className="flex items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <Volume2 className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
                    <span className="text-sm text-primary-700 dark:text-primary-300">
                      Voice powered by Eleven Labs AI
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleSuggestionClick('Check my child\'s vaccination schedule')}
                  className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="flex items-center">
                    <Stethoscope className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Check Vaccination Schedule</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSuggestionClick('Analyze symptoms for my child')}
                  className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Symptom Analysis</span>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSuggestionClick('Find pediatric clinics near me')}
                  className="w-full text-left p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors group"
                >
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 text-secondary-600 dark:text-secondary-400 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Find Clinics</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                    <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">AI Health Assistant</h3>
                    <p className="text-sm text-success-600 dark:text-success-400 flex items-center">
                      <div className="h-2 w-2 bg-success-500 rounded-full mr-2 animate-pulse"></div>
                      Online
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`flex items-start ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                          }`}>
                            {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                        }`}>
                          <div className="flex justify-between items-start">
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                            {message.type === 'ai' && message.hasAudio && (
                              <button 
                                onClick={() => handlePlayAudio(message.id, message.content)}
                                className={`ml-2 p-1 rounded-full ${
                                  isPlayingAudio === message.id 
                                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 animate-pulse' 
                                    : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
                                }`}
                                title="Listen to response"
                              >
                                <Volume2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Suggestions */}
                      {message.suggestions && message.type === 'ai' && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-700 px-4 py-2 rounded-lg">
                      <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything about health and vaccinations..."
                      className="w-full px-4 py-2 pr-20 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <button
                        onClick={toggleVoiceInput}
                        className={`p-1 rounded ${isListening ? 'text-error-600' : 'text-neutral-400 hover:text-neutral-600'}`}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                      <button className="p-1 text-neutral-400 hover:text-neutral-600">
                        <Image className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHealthAssistant;