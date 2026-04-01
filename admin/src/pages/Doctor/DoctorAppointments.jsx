import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import HealthProfileModal from "../../components/HealthProfileModal";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    backendUrl
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh]   ">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.reverse().map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />{" "}
              <div>
                <p>{item.userData.name}</p>
                <div 
                  onClick={() => setSelectedAppointment(item)}
                  className="inline-block mt-1"
                >
                  <button className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100 hover:from-indigo-500 hover:to-purple-600 hover:text-white px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm transition-all duration-300 transform hover:scale-[1.03]">
                    <span>✨</span> View AI Profile
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Onlone" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <div className="flex flex-col gap-1 items-end">
                <p className="text-green-500 text-xs font-medium">Completed</p>
                <button
                  onClick={() => window.open(`/doctor-prescription/${item._id}`, '_blank')}
                  className="bg-purple-50 text-purple-600 text-xs px-3 py-1 rounded hover:bg-purple-500 hover:text-white transition-all shadow-sm border border-purple-100"
                >
                  Prescription
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(`/doctor-video-call/${item._id}`, '_blank')}
                  className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded hover:bg-green-500 hover:text-white transition-all"
                >
                  Video
                </button>
                <button
                  onClick={() => window.open(`/doctor-chat/${item._id}`, '_blank')}
                  className="bg-blue-50 text-blue-500 text-xs px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition-all"
                >
                  Chat
                </button>
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <HealthProfileModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        dToken={dToken}
        backendUrl={backendUrl}
      />
    </div>
  );
};

export default DoctorAppointments;
