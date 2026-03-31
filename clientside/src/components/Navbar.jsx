import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { token, setToken, userData, notifications, fetchNotifications, backendUrl } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  const markAllRead = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/notifications/clear', {}, { headers: { token } })
      if (data.success) {
        fetchNotifications()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4'>
        {
          token
            ? <div className='flex items-center gap-4'>
              {/* Notification Bell */}
              <div className='relative cursor-pointer' onClick={() => setShowNotifications(!showNotifications)}>
                <svg className="w-6 h-6 text-gray-600 hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {unreadCount > 0 && <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full'>{unreadCount}</span>}

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className='absolute right-0 mt-4 w-72 bg-white rounded-lg shadow-xl border z-50 overflow-hidden'>
                    <div className='flex justify-between items-center p-3 border-b bg-gray-50'>
                      <span className='font-semibold text-gray-700'>Notifications</span>
                      {notifications.length > 0 && (
                        <span onClick={(e) => { e.stopPropagation(); markAllRead(); }} className='text-xs text-primary hover:underline cursor-pointer'>Clear All</span>
                      )}
                    </div>
                    <div className='max-h-80 overflow-y-auto'>
                      {notifications.length > 0 ? notifications.map((notif, index) => (
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

              {/* Profile Dropdown */}
              <div className='flex items-center gap-2 cursor-pointer group relative'>
                <img className='w-8 h-8 rounded-full object-cover' src={userData ? userData.image : assets.profile_pic} alt="" />
                <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                <div className='absolute top-0 right-0 pt-10 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                  <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4 shadow-lg border'>
                    <p onClick={() => navigate('/my-profile')} className='hover:text-primary cursor-pointer transition-colors'>My Profile</p>
                    <p onClick={() => navigate('/my-appointments')} className='hover:text-primary cursor-pointer transition-colors'>My Appointments</p>
                    <p onClick={logout} className='hover:text-red-500 cursor-pointer transition-colors'>Logout</p>
                  </div>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-opacity-90 transition-all'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar
