import React from 'react';
import { useNavigate } from 'react-router-dom';
import { specialityData } from '../assets/assets';

const ArivuMessages = ({ message }) => {
    const isAssistant = message.role === 'assistant';
    const navigate = useNavigate();

    // Check if the assistant message suggests a specialty
    let suggestedSpecialty = null;
    if (isAssistant) {
        for (const spec of specialityData) {
            if (message.content.toLowerCase().includes(spec.speciality.toLowerCase())) {
                suggestedSpecialty = spec.speciality;
                break;
            }
        }
    }

    const hasUrgentWarning = isAssistant && (message.content.toLowerCase().includes('emergency') || message.content.toLowerCase().includes('hospital'));

    return (
        <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
            <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm ${isAssistant
                        ? hasUrgentWarning
                            ? 'bg-red-100 text-red-800 border-l-4 border-red-500'
                            : 'bg-white text-gray-800 border border-gray-200'
                        : 'bg-primary text-white rounded-br-none'
                    }`}
            >
                {message.content}
            </div>

            {/* Action buttons embedded in assistant's message cursor */}
            {suggestedSpecialty && !hasUrgentWarning && (
                <div className="mt-2 flex gap-2 w-full justify-start pl-2">
                    <button
                        onClick={() => navigate(`/doctors/${suggestedSpecialty}`)}
                        className="text-xs bg-indigo-50 text-primary border border-primary/20 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-all shadow-sm"
                    >
                        View {suggestedSpecialty}s
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArivuMessages;
