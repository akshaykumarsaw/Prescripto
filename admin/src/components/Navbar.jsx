import React, { useContext, useState } from "react";
import axios from 'axios';
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };

  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, fetchNotifications, backendUrl } = useContext(DoctorContext);

  const markAllRead = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/notifications/doctor/clear', {}, { headers: { dToken } })
      if (data.success) {
        fetchNotifications()
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Effect to fetch notifications when logged in as a doctor
  React.useEffect(() => {
    if (dToken) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [dToken]);

  const unreadCount = dToken && notifications ? notifications.filter(n => !n.isRead).length : 0;

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm::w-40 cursor-pointer"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <div className="flex items-center gap-4 text-sm font-medium">
        {/* Notification Bell (Only for Doctor) */}
        {dToken && (
          <div className='relative cursor-pointer' onClick={() => setShowNotifications(!showNotifications)}>
            <svg className="w-6 h-6 text-gray-600 hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            {unreadCount > 0 && <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full'>{unreadCount}</span>}

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className='absolute right-0 mt-4 w-72 bg-white rounded-lg shadow-xl border z-50 overflow-hidden font-normal text-left text-xs sm:text-sm'>
                <div className='flex justify-between items-center p-3 border-b bg-gray-50'>
                  <span className='font-semibold text-gray-700'>Notifications</span>
                  {notifications.length > 0 && (
                    <span onClick={(e) => { e.stopPropagation(); markAllRead(); }} className='text-xs text-primary hover:underline cursor-pointer'>Clear All</span>
                  )}
                </div>
                <div className='max-h-80 overflow-y-auto'>
                  {notifications?.length > 0 ? notifications.map((notif, index) => (
                    <div key={index} className='p-3 border-b hover:bg-gray-50 flex flex-col gap-1'>
                      <span className='text-sm font-medium text-gray-800'>{notif.title}</span>
                      <span className='text-xs text-gray-600 line-clamp-2'>{notif.message}</span>
                      <span className='text-[10px] text-gray-400 mt-1'>{new Date(notif.date).toLocaleDateString()} {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )) : (
                    <div className='p-6 text-center text-sm text-gray-500'>No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className="bg-primary text-white text-sm px-10 py-2 rounded-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
