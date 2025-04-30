import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Format the response with proper markdown
      const formattedMessage = `
Nkurikije ibyo nzi, hari ibiribwa bimwe byakongera **imbaraga**, harimo:

* **Amashaza**: Akungahaza ku butare bwa zinc, bukaba ari ingenzi mu gutera akanyabugabo
* **Ibinyomoro (avocado)**: Birimo amavuta meza ndetse n'ibinyasukari bikenewe
* **Amavuta y'ibihwagari (olive oil)**: Akora ku buzima bw'imyanya ndangagitsina
* **Ibiryo birimo poroteyine nyinshi**: Nka poroteyine zituruka ku nyama, amafi, no mu byokurya by'ibihwagari (nut butter)
* **Ibinyomoro**: Nka avokado, ibinyomoro by'icyatsi, na karoti
* **Inyama z'inyoni**: Nka inkoko, zifite poroteyine nyinshi

Ni byiza kurya ibiribwa bitandukanye kugirango ugire **ubuzima bwiza** no kugira **akanyabugabo**. Uramutse ufite ibindi bibazo, ndahari kugufasha!
`;

      // Simulate API response with formatted message
      setMessages(prev => [...prev, { type: 'bot', content: formattedMessage }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', content: `Error: ${error instanceof Error ? error.message : 'Something went wrong'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-white border-b px-6 py-3 flex items-center">
        <div className="flex items-center gap-4">
          <img src="/solid-africa-logo.png" alt="Solid Africa Logo" className="h-12 w-auto" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-[#9B1C1C]">Nutrition Assistant</h1>
            <p className="text-sm text-gray-600">Ask me about nutrition</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-4 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto mb-4 rounded-lg bg-gray-50 p-4 shadow-lg">
          {messages.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              <Bot size={48} className="mx-auto mb-4 text-[#9B1C1C]" />
              <p>Hello! I'm your nutrition assistant. How can I help you today?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-[#9B1C1C]' : 'bg-gray-200'
                  }`}>
                    {message.type === 'user' ? (
                      <User size={20} className="text-white" />
                    ) : (
                      <Bot size={20} className="text-[#9B1C1C]" />
                    )}
                  </div>
                  <div className={`flex-1 rounded-lg p-4 ${
                    message.type === 'user' 
                      ? 'bg-[#9B1C1C] text-white ml-12' 
                      : 'bg-gray-200 text-gray-800 mr-12'
                  }`}>
                    {message.type === 'bot' ? (
                      <ReactMarkdown 
                        className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:my-1 prose-li:my-0"
                        components={{
                          ul: ({node, ...props}) => <ul className="list-disc list-inside" {...props} />,
                          li: ({node, ...props}) => <li className="my-1" {...props} />,
                          p: ({node, ...props}) => <p className="my-2" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold" {...props} />
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot size={20} className="text-[#9B1C1C]" />
                  </div>
                  <div className="flex-1 rounded-lg p-4 bg-gray-200 text-gray-800 mr-12">
                    <div className="flex gap-2">
                      <span className="animate-bounce text-[#9B1C1C]">●</span>
                      <span className="animate-bounce text-[#9B1C1C]" style={{ animationDelay: '0.2s' }}>●</span>
                      <span className="animate-bounce text-[#9B1C1C]" style={{ animationDelay: '0.4s' }}>●</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your nutrition question here..."
            className="flex-1 rounded-lg bg-gray-50 text-gray-800 p-4 border border-gray-200 focus:outline-none focus:border-[#9B1C1C] focus:ring-1 focus:ring-[#9B1C1C] placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-[#9B1C1C] text-white rounded-lg px-6 py-4 hover:bg-[#7C1616] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
