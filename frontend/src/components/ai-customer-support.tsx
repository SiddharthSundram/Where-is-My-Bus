"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CSSShuttleBackground } from '@/components/shuttle-background';
import { 
  generateCustomerSupportResponse, 
  generateImage,
  performWebSearch 
} from '@/lib/ai-service';
import { 
  FaRobot, 
  FaUser, 
  FaPaperPlane, 
  FaSearch, 
  FaImage, 
  FaThumbsUp,
  FaThumbsDown,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  image?: string;
  searchResults?: any[];
  feedback?: 'positive' | 'negative';
}

export default function AICustomerSupport() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant for "Where is My Bus". How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateCustomerSupportResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await performWebSearch(searchQuery, 5);
      
      const searchMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I found some information related to "${searchQuery}":`,
        timestamp: new Date(),
        searchResults: results,
      };

      setMessages(prev => [...prev, searchMessage]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error performing web search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGeneratingImage(true);
    try {
      const imageData = await generateImage(imagePrompt);
      
      const imageMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Here's an image based on your prompt "${imagePrompt}":`,
        timestamp: new Date(),
        image: `data:image/png;base64,${imageData}`,
      };

      setMessages(prev => [...prev, imageMessage]);
      setImagePrompt('');
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Shuttle Background Animation */}
      <CSSShuttleBackground />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Card className="bg-gradient-to-br from-slate-800/50 to-blue-800/50 border-slate-600/30 h-[calc(100vh-2rem)]">
          <CardHeader className="border-b border-slate-600/30">
            <CardTitle className="flex items-center gap-2 text-slate-300">
              <FaRobot className="text-blue-400" />
              AI Customer Support
            </CardTitle>
            <CardDescription className="text-slate-400">
              Get instant help with your bus tracking needs using AI-powered assistance
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[calc(100%-8rem)]">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <FaRobot className="text-white text-sm" />
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                        : 'bg-gradient-to-r from-slate-700 to-blue-700'
                    } rounded-lg p-3`}>
                      <div className="text-sm text-white">
                        {message.content}
                      </div>
                      
                      {message.image && (
                        <div className="mt-3">
                          <img 
                            src={message.image} 
                            alt="Generated" 
                            className="max-w-full h-auto rounded-lg"
                          />
                        </div>
                      )}
                      
                      {message.searchResults && (
                        <div className="mt-3 space-y-2">
                          {message.searchResults.map((result, index) => (
                            <div key={index} className="bg-slate-600/50 rounded p-2">
                              <div className="text-xs text-blue-300 font-medium">
                                {result.name}
                              </div>
                              <div className="text-xs text-slate-300 mt-1">
                                {result.snippet}
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {result.url}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-slate-300">
                          {formatTime(message.timestamp)}
                        </div>
                        
                        {message.type === 'ai' && !message.feedback && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleFeedback(message.id, 'positive')}
                              className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                            >
                              <FaThumbsUp className="text-xs" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleFeedback(message.id, 'negative')}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                            >
                              <FaThumbsDown className="text-xs" />
                            </Button>
                          </div>
                        )}
                        
                        {message.feedback && (
                          <div className="text-xs">
                            {message.feedback === 'positive' ? (
                              <FaThumbsUp className="text-green-400" />
                            ) : (
                              <FaThumbsDown className="text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <FaRobot className="text-white text-sm" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-slate-700 to-blue-700 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <div className="text-sm text-slate-300">AI is thinking...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* AI Tools */}
            <div className="border-t border-slate-600/30 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search the web..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-700/50 border-slate-600/30 text-slate-300 placeholder-slate-500"
                  />
                  <Button
                    onClick={handleWebSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaSearch />
                    )}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Generate image..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="bg-slate-700/50 border-slate-600/30 text-slate-300 placeholder-slate-500"
                  />
                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGeneratingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaImage />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  className="bg-slate-700/50 border-slate-600/30 text-slate-300 placeholder-slate-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <FaPaperPlane />
                </Button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 cursor-pointer hover:bg-slate-700/70">
                  <FaClock className="mr-1" />
                  Bus Schedule
                </Badge>
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 cursor-pointer hover:bg-slate-700/70">
                  <FaCheckCircle className="mr-1" />
                  Booking Status
                </Badge>
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 cursor-pointer hover:bg-slate-700/70">
                  <FaSearch className="mr-1" />
                  Route Info
                </Badge>
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 cursor-pointer hover:bg-slate-700/70">
                  <FaImage className="mr-1" />
                  Generate Map
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}