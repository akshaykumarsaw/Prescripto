import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Chat = () => {
    const { appointmentId } = useParams();
    const { token, backendUrl, userData } = useContext(AppContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!token || !userData) return;

        // Fetch appointment details to verify access
        const fetchDetails = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
                if (data.success) {
                    const apt = data.appointments.find(a => a._id === appointmentId);
                    if (!apt) {
                        navigate('/my-appointments');
                        return;
                    }
                    setAppointment(apt);
                }
            } catch (error) {
                console.error(error);
            }
        };

        // Fetch past messages
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/chat/' + appointmentId);
                if (data.success) {
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDetails();
        fetchMessages();

        // Connect Socket
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join_appointment', appointmentId);
        });

        newSocket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => newSocket.disconnect();
    }, [appointmentId, token, backendUrl, userData]);

    const handleSend = () => {
        if (!input.trim() || !socket || !userData) return;

        const messageData = {
            appointmentId,
            senderId: userData._id,
            senderModel: 'user',
            text: input
        };

        socket.emit('send_message', messageData);
        setInput('');
    };

    if (!appointment) return <div className="p-10 text-center">Loading chat...</div>;

    return (
        <div className="max-w-4xl mx-auto my-6 border border-gray-200 rounded-lg overflow-hidden flex flex-col h-[70vh]">
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center gap-4">
                <img src={appointment.docData.image} alt="" className="w-12 h-12 rounded-full border-2 border-white bg-indigo-50 object-cover" />
                <div>
                    <h2 className="font-medium text-lg">{appointment.docData.name}</h2>
                    <p className="text-sm opacity-80">{appointment.docData.speciality} • {appointment.slotDate} | {appointment.slotTime}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                <div className="text-center text-xs text-gray-400 mb-4">
                    Chat is secured and encrypted. Messages will be preserved for your medical records.
                </div>
                {messages.map((msg, idx) => {
                    const isMe = msg.senderModel === 'user';
                    return (
                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message to the doctor..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                    onClick={handleSend}
                    className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-all flex items-center justify-center"
                >
                    <svg className="w-5 h-5 transform rotate-90 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </div>
        </div>
    );
};

export default Chat;
