import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorVideoCall = () => {
    const { appointmentId } = useParams();
    const { dToken, appointments, profileData } = useContext(DoctorContext);
    const [appointment, setAppointment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!dToken) {
            navigate('/');
            return;
        }

        const apt = appointments.find(a => a._id === appointmentId);
        if (apt) {
            setAppointment(apt);
        } else {
            navigate('/doctor-appointments');
        }

    }, [dToken, appointmentId, appointments, navigate]);

    if (!appointment) return <div className="p-10 text-center">Loading video consultation...</div>;

    const roomName = appointment.roomName || `prescripto_video_${appointmentId}`;

    return (
        <div className="flex-1 h-[85vh] flex flex-col my-4 mx-4 border rounded-lg overflow-hidden relative shadow-sm bg-white">
            <div className="bg-primary text-white p-4 flex justify-between items-center z-10 shrink-0">
                <div>
                    <h2 className="text-xl font-medium">Consultation with {appointment.userData.name}</h2>
                    <p className="text-sm opacity-80">Patient | {appointment.slotDate} at {appointment.slotTime}</p>
                </div>
                <button
                    onClick={() => navigate('/doctor-appointments')}
                    className="bg-white text-primary px-4 py-2 rounded font-medium hover:bg-gray-100 transition-all"
                >
                    End & Leave
                </button>
            </div>

            <div className="flex-1 w-full bg-slate-900 min-h-0">
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
                        displayName: `Dr. ${profileData?.name || appointment.docData.name}`,
                        email: profileData?.email
                    }}
                    onApiReady={(externalApi) => {
                        externalApi.on('videoConferenceLeft', () => {
                            navigate('/doctor-appointments');
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

export default DoctorVideoCall;
