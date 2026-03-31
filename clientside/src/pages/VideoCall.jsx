import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const VideoCall = () => {
    const { appointmentId } = useParams();
    const { token, backendUrl, userData, doctors } = useContext(AppContext);
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchAppointment = async () => {
            try {
                const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
                if (data.success) {
                    const apt = data.appointments.find(a => a._id === appointmentId);
                    if (apt) {
                        setAppointment(apt);
                    } else {
                        navigate('/my-appointments');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchAppointment();
    }, [token, appointmentId, backendUrl, navigate]);

    if (!appointment) return <div className="p-10 text-center">Loading video consultation...</div>;

    const roomName = appointment.roomName || `prescripto_video_${appointmentId}`;

    return (
        <div className="w-full h-[80vh] flex flex-col my-4 border rounded-lg overflow-hidden relative shadow-sm">
            <div className="bg-primary text-white p-4 flex justify-between items-center z-10">
                <div>
                    <h2 className="text-xl font-medium">Video Consultation: Dr. {appointment.docData.name}</h2>
                    <p className="text-sm opacity-80">{appointment.docData.speciality} | {appointment.slotDate} at {appointment.slotTime}</p>
                </div>
                <button
                    onClick={() => navigate('/my-appointments')}
                    className="bg-white text-primary px-4 py-2 rounded font-medium hover:bg-gray-100 transition-all"
                >
                    Leave Room
                </button>
            </div>

            <div className="flex-1 w-full bg-slate-900">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        disableModeratorIndicator: true,
                        enableEmailInStats: false,
                        prejoinPageEnabled: false,
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    }}
                    userInfo={{
                        displayName: userData?.name || 'Patient',
                        email: userData?.email
                    }}
                    onApiReady={(externalApi) => {
                        externalApi.on('videoConferenceLeft', () => {
                            navigate('/my-appointments');
                        });
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                        iframeRef.style.width = '100%';
                    }}
                />
            </div>
        </div>
    );
};

export default VideoCall;
