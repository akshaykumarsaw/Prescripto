import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import ReactMarkdown from 'react-markdown';

const HealthProfileModal = ({ isOpen, onClose, dToken, backendUrl, appointment }) => {
  const [activeTab, setActiveTab] = useState("ai");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [rawUser, setRawUser] = useState(null);
  const [rawRecords, setRawRecords] = useState([]);

  useEffect(() => {
    if (isOpen && appointment) {
      if (rawUser?._id !== appointment.userId) {
        fetchProfileSummary();
      }
    }
  }, [isOpen, appointment]);

  const fetchProfileSummary = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/patient-summary",
        { userId: appointment.userId },
        { headers: { dToken } }
      );
      if (data.success) {
        setSummary(data.summary);
        setRawUser(data.rawUser);
        setRawRecords(data.rawRecords);
        setActiveTab("ai");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch health profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <img src={appointment.userData.image} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{appointment.userData.name}</h2>
              <p className="text-sm text-gray-500">Comprehensive Clinical Profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 mt-2">
          <button
            onClick={() => setActiveTab("ai")}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-all ${activeTab === "ai" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            🧠 AI Dashboard
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-all ${activeTab === "raw" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            📝 Raw Lifestyle Form
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-all ${activeTab === "files" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            📂 Medical Records <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{rawRecords?.length || 0}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p>Analyzing Patient Intake and Records via AI...</p>
            </div>
          ) : (
            <>
              {/* AI Tab */}
              {activeTab === "ai" && (
                <div className="text-sm text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-100 overflow-auto shadow-inner">
                  {summary ? (
                    <div className="prose prose-sm prose-headings:text-indigo-900 prose-headings:font-bold prose-headings:mb-3 prose-headings:mt-6 prose-p:text-gray-700 prose-li:marker:text-primary max-w-none prose-a:text-indigo-600 prose-strong:text-gray-900 leading-relaxed">
                      <ReactMarkdown>{summary}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="italic text-gray-400">No summary available. Please fill in your profile on the patient portal first.</p>
                  )}
                </div>
              )}

              {/* Raw Form Tab */}
              {activeTab === "raw" && rawUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                  <div>
                     <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Basic Metrics</h3>
                     <div className="grid grid-cols-2 gap-2 text-gray-600">
                        <p className="font-medium text-gray-800">Age:</p><p>{rawUser.age || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Gender:</p><p>{rawUser.gender || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Blood Group:</p><p>{rawUser.bloodGroup || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Height:</p><p>{rawUser.height || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Weight:</p><p>{rawUser.weight || 'N/A'}</p>
                     </div>

                     <h3 className="font-semibold text-gray-800 border-b pb-2 mt-6 mb-3">Chief Complaints / Feelings</h3>
                     <p className="text-gray-600 bg-gray-50 p-3 rounded italic">{rawUser.feeling || "No response provided."}</p>
                  </div>
                  
                  <div>
                     <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Lifestyle Questionnaire</h3>
                     <div className="grid grid-cols-2 gap-2 text-gray-600">
                        <p className="font-medium text-gray-800">Smoking:</p><p>{rawUser.smokingStatus || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Alcohol:</p><p>{rawUser.alcoholConsumption || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Diet:</p><p>{rawUser.dietType || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Activity Level:</p><p>{rawUser.dailyRoutine || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Exercise:</p><p>{rawUser.exerciseFrequency || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Sleep Pattern:</p><p>{rawUser.sleepPattern || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Stress Coping:</p><p>{rawUser.stressCoping || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Sugar Cravings:</p><p>{rawUser.sugarCravings || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Get Fatigue:</p><p>{rawUser.fatigueOften || 'N/A'}</p>
                        <p className="font-medium text-gray-800">Flu Frequency:</p><p>{rawUser.fluFrequency || 'N/A'}</p>
                     </div>

                     <h3 className="font-semibold text-gray-800 border-b pb-2 mt-6 mb-3">Medical Hazards</h3>
                     <div className="flex flex-col gap-2">
                        <div>
                          <p className="font-medium text-gray-800">Food Allergies:</p>
                          <p className="text-gray-600">{rawUser.foodAllergies === 'Yes' ? rawUser.foodAllergiesDetail || 'Yes (No details specified)' : 'No'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Daily Medication:</p>
                          <p className="text-gray-600">{rawUser.dailyMedication === 'Yes' ? rawUser.dailyMedicationDetail || 'Yes (No details specified)' : 'No'}</p>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {/* Attachments Tab */}
              {activeTab === "files" && (
                <div className="space-y-4">
                  {rawRecords && rawRecords.length > 0 ? (
                    rawRecords.map(record => (
                      <div key={record._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-gray-50">
                        <div className="flex items-center gap-3">
                           <div className="bg-primary/10 p-2 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                           </div>
                           <div>
                              <p className="font-semibold text-gray-800">{record.title}</p>
                              <p className="text-xs text-gray-500">Uploaded: {new Date(record.date).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => window.open(`${backendUrl}/api/user/view-record/${record._id}?token=${dToken}`, '_blank')}
                          className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          View File
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500 italic">No external health records uploaded by patient.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthProfileModal;
