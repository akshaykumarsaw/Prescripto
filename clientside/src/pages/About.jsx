import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight uppercase">
          About <span className="text-slate-500">Us</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-inter">
          Improving the way you manage health by connecting patients and doctors seamlessly.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
        <div className="w-full lg:w-5/12 relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform -translate-y-4 scale-105"></div>
          <div className="rounded-3xl overflow-hidden shadow-premium relative bg-white border border-slate-100 p-2">
            <img
              className="w-full h-auto rounded-2xl object-cover"
              src={assets.about_image}
              alt="About Prescripto"
            />
          </div>
        </div>

        <div className="w-full lg:w-7/12 flex flex-col justify-center text-slate-600 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Our Story</h2>
          <p className="font-inter leading-relaxed text-slate-500">
            Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p className="font-inter leading-relaxed text-slate-500">
            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4 border-l-4 border-l-primary">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Our Vision</h3>
            <p className="font-inter leading-relaxed text-slate-500 text-sm">
              Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Why Choose Us</h2>
        <p className="text-slate-500 mt-3 font-inter max-w-2xl mx-auto">We provide the best healthcare management solutions tailored for your lifestyle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Efficiency</h3>
          <p className="text-slate-500 text-sm font-inter leading-relaxed">
            Streamlined appointment scheduling that fits seamlessly into your busy lifestyle without any hassle.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Convenience</h3>
          <p className="text-slate-500 text-sm font-inter leading-relaxed">
            Instant access to a vast network of verified and trusted healthcare professionals in your area.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Personalization</h3>
          <p className="text-slate-500 text-sm font-inter leading-relaxed">
            Tailored recommendations, medicine reminders, and a comprehensive platform to help you stay on top of your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
