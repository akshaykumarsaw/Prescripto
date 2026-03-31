import React, { useState } from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "You can book an appointment by navigating to the Doctors page, selecting a specialist, and choosing an available time slot."
    },
    {
      question: "Is there a cancellation fee?",
      answer: "Cancellation is free if done at least 24 hours before the scheduled appointment time. Later cancellations may incur a nominal fee."
    },
    {
      question: "Are my medical records secure?",
      answer: "Yes, we use industry-standard encryption to ensure that your health data and medical records are highly secure and confidential."
    }
  ];

  return (
    <div className="animate-fade-in max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight uppercase">
          Contact <span className="text-slate-500">Us</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-inter">
          Have questions or need assistance? Our support team is here to help you navigate your healthcare journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-white p-2">
            <img
              className="w-full h-80 object-cover rounded-2xl"
              src={assets.contact_image}
              alt="Contact Support"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Our Office</h3>
              <p className="text-slate-500 text-sm font-inter">54709 Willms Station<br />Suite 350, Washington, USA</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Contact Details</h3>
              <p className="text-slate-500 text-sm font-inter">Tel: (415) 555‑0132<br />support@prescripto.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-premium border border-slate-100 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a message</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                <input type="text" placeholder="John" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-inter" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-inter" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-inter" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea rows="4" placeholder="How can we help you?" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-inter resize-none"></textarea>
            </div>
            <button className="w-full bg-primary hover:bg-primaryDark text-white font-semibold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-md">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-semibold text-slate-800">{faq.question}</span>
                <svg className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-500 font-inter text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
