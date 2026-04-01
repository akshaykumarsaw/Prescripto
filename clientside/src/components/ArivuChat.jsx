import React, { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import ArivuMessages from './ArivuMessages';

const ArivuChat = () => {
    const { token, backendUrl } = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'assistant', content: "Hello! I'm Arivu, your medical AI assistant. I can help guide you to the right specialist. What symptoms are you experiencing?" }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatId, setChatId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || !token) {
            if (!token) toast.warning("Please login to use Arivu Chat");
            return;
        }

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const { data } = await axios.post(backendUrl + '/api/arivu/chat',
                { messages: newMessages, chatId },
                { headers: { token } }
            );

            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
                if (data.chatId && !chatId) {
                    setChatId(data.chatId);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null; // Only show for logged in users

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col mb-4" style={{ height: '500px' }}>
                    <div className="bg-primary text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">Arivu Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                            ✕
                        </button>
                    </div>

                    <div className="bg-yellow-50 text-yellow-800 text-xs p-2 text-center border-b border-yellow-200">
                        Arivu provides recommendations, not medical diagnoses. In an emergency, please visit a hospital.
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
                        {messages.map((msg, index) => (
                            <ArivuMessages key={index} message={msg} />
                        ))}
                        {isLoading && (
                            <div className="text-gray-400 text-sm italic">Arivu is typing...</div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Type your symptoms..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors w-9 h-9 flex items-center justify-center"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center relative group"
                >
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span className="absolute right-full mr-3 whitespace-nowrap bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Chat with Arivu
                    </span>
                </button>
            )}
        </div>
    );
};

export default ArivuChat;
