import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
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
                <div className="group relative inline-block">
                  <span className="text-[10px] text-blue-500 cursor-pointer border-b border-blue-500 border-dashed">Health Profile</span>
                  <div className="hidden group-hover:block absolute z-20 w-56 bg-white border border-gray-200 rounded shadow-xl p-3 left-0 top-full mt-1 text-xs text-gray-600">
                    <p className="font-semibold text-gray-800 mb-1 border-b pb-1">Lifestyle & Vitals</p>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <p className="font-medium">Smoking:</p><p>{item.userData.smokingStatus || 'N/A'}</p>
                      <p className="font-medium">Alcohol:</p><p>{item.userData.alcoholConsumption || 'N/A'}</p>
                      <p className="font-medium">Activity:</p><p>{item.userData.activityLevel || 'N/A'}</p>
                      <p className="font-medium">Diet:</p><p>{item.userData.dietaryPreferences || 'N/A'}</p>
                    </div>
                    <div className="mt-2 text-red-500">
                      <p><span className="font-medium text-gray-700">Allergies: </span>{item.userData.knownAllergies || 'None'}</p>
                      <p><span className="font-medium text-gray-700">Chronic: </span>{item.userData.chronicConditions || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full bg-gray-200"
                src={item.docData.image}
                alt=""
              />{" "}
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium">Completed</p>
            ) : (
              <img
                onClick={() => cancelAppointment(item._id)}
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
