import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    let filtered = doctors;
    if (speciality) {
      filtered = filtered.filter((doc) => doc.speciality === speciality);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((doc) => doc.name.toLowerCase().includes(q) || doc.speciality.toLowerCase().includes(q));
    }
    setFilterDoc(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, searchQuery]);

  // Basic Voice Search Implementation
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      alert("Voice search is not supported in your browser.");
    }
  };

  return (
    <div className="animate-fade-in py-8 sm:px-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Find a Doctor</h1>
          <p className="text-slate-500 mt-1 font-inter">Browse our extensive list of specialist doctors.</p>
        </div>

        <div className="w-full md:w-96 relative flex items-center">
          <input
            type="text"
            placeholder="Search doctors, specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-inter text-sm"
          />
          <svg className="w-5 h-5 absolute left-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>

          <button
            onClick={startVoiceSearch}
            className={`absolute right-2 p-2 rounded-full transition-all ${isListening ? 'bg-rose-100 text-rose-500 animate-pulse' : 'hover:bg-slate-100 text-slate-500'}`}
            title="Voice Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-8 mt-5">
        <button
          className={`py-2 px-4 border rounded-lg text-sm transition-all sm:hidden font-medium shadow-sm ${showFilter ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200"
            }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          {showFilter ? "Hide Filters" : "Show Specialties"}
        </button>

        {/* Specialties Sidebar */}
        <div
          className={`sm:min-w-[240px] flex-col gap-2 text-sm text-slate-600 ${showFilter ? "flex" : "hidden sm:flex"
            }`}
        >
          <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm max-h-[70vh] overflow-y-auto no-scrollbar">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Specialties</h3>

            <p
              onClick={() => navigate('/doctors')}
              className={`w-full px-4 py-2.5 rounded-xl transition-all font-medium cursor-pointer flex items-center justify-between group ${!speciality ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-slate-50 text-slate-600"
                }`}
            >
              Doctors
              <span className={`text-xs py-0.5 px-2 rounded-full ${!speciality ? 'bg-white/20' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                {doctors.length}
              </span>
            </p>

            <div className="my-2 border-t border-slate-100"></div>

            {specialityData.map((item, index) => {
              const count = doctors.filter(d => d.speciality === item.speciality).length;
              const isActive = speciality === item.speciality;

              return (
                <p
                  key={index}
                  onClick={() => isActive ? navigate('/doctors') : navigate(`/doctors/${item.speciality}`)}
                  className={`w-full px-4 py-2.5 rounded-xl transition-all font-inter cursor-pointer flex items-center justify-between mb-1 group ${isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-slate-50 text-slate-600"
                    }`}
                >
                  {item.speciality}
                  <span className={`text-xs py-0.5 px-2 rounded-full ${isActive ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                    {count}
                  </span>
                </p>
              );
            })}
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="w-full flex-1">
          {filterDoc.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800">No doctors found</h3>
              <p className="text-slate-500 mt-2 font-inter max-w-sm">We couldn't find any doctors matching your search criteria. Try adjusting your filters or search terms.</p>
              <button
                onClick={() => { setSearchQuery(""); navigate('/doctors'); }}
                className="mt-6 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-all font-inter"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterDoc.map((item, index) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                  key={index}
                >
                  <div className="bg-blue-50">
                    <img className="bg-blue-50" src={item.image} alt={item.name} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'
                          }`}
                      >
                        <p
                          className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'
                            } rounded-full`}
                        ></p>
                        <p>{item.available ? 'Available' : 'Not Available'}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-sm">
                        ★ <span className="text-gray-600 font-medium font-inter">{item.rating > 0 ? item.rating.toFixed(1) : "4.8"}</span>
                        {item.reviews && item.reviews.length > 0 && (
                          <span className="text-gray-400 text-xs">({item.reviews.length})</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.speciality}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
