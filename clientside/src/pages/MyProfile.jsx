import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [recordTitle, setRecordTitle] = useState("");
  const [recordFile, setRecordFile] = useState(null);
  const [uploadingRecord, setUploadingRecord] = useState(false);

  useEffect(() => {
    if (token) {
      fetchHealthRecords();
    }
  }, [token]);

  const fetchHealthRecords = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/health-records", { headers: { token } });
      if (data.success) {
        setHealthRecords(data.records);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadRecord = async (e) => {
    e.preventDefault();
    if (!recordTitle || !recordFile) return;

    setUploadingRecord(true);
    try {
      const formData = new FormData();
      formData.append("title", recordTitle);
      formData.append("document", recordFile);

      const { data } = await axios.post(backendUrl + "/api/user/upload-record", formData, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        setRecordTitle("");
        setRecordFile(null);
        e.target.reset();
        fetchHealthRecords();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setUploadingRecord(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm("Are you sure you want to permanently delete this health record? This action cannot be undone.")) {
      try {
        const { data } = await axios.post(backendUrl + "/api/user/delete-record", { recordId }, { headers: { token } });
        if (data.success) {
          toast.success(data.message);
          fetchHealthRecords();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name || "");
      formData.append("phone", userData.phone || "");
      formData.append("address", JSON.stringify(userData.address || {}));
      formData.append("gender", userData.gender || "");
      formData.append("dob", userData.dob || "");
      
      formData.append("age", userData.age || "");
      formData.append("bloodGroup", userData.bloodGroup || "Not Selected");
      formData.append("height", userData.height || "");
      formData.append("weight", userData.weight || "");

      formData.append("dietType", userData.dietType || "Not Selected");
      formData.append("foodAllergies", userData.foodAllergies || "Not Selected");
      formData.append("foodAllergiesDetail", userData.foodAllergiesDetail || "");
      formData.append("sugarCravings", userData.sugarCravings || "Not Selected");
      formData.append("dailyRoutine", userData.dailyRoutine || "Not Selected");
      formData.append("fatigueOften", userData.fatigueOften || "Not Selected");
      formData.append("exerciseFrequency", userData.exerciseFrequency || "Not Selected");
      formData.append("sleepPattern", userData.sleepPattern || "Not Selected");
      formData.append("stressCoping", userData.stressCoping || "Not Selected");
      formData.append("fluFrequency", userData.fluFrequency || "Not Selected");
      formData.append("dailyMedication", userData.dailyMedication || "Not Selected");
      formData.append("dailyMedicationDetail", userData.dailyMedicationDetail || "");
      formData.append("smokingStatus", userData.smokingStatus || "Not Selected");
      formData.append("alcoholConsumption", userData.alcoholConsumption || "Not Selected");
      
      formData.append("feeling", userData.feeling || "");

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-2xl flex flex-col gap-2 text-sm">
        {userData.lastUpdatedDate ? (
          <p className="text-xs text-gray-400 mb-2 italic">
            Profile last updated: {new Date(userData.lastUpdatedDate).toLocaleString()}
          </p>
        ) : null}

        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData.image} alt="" />
        )}

        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.email}</p>

            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}

            <p className="font-medium mt-1">Address:</p>
            {isEdit ? (
              <div className="flex flex-col gap-2 max-w-64">
                <input
                  className="bg-gray-50 p-1.5 border border-gray-200 rounded text-sm"
                  placeholder="Address Line 1"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...(prev.address || {}), line1: e.target.value },
                    }))
                  }
                  value={userData.address?.line1 || ""}
                  type="text"
                />
                <input
                  className="bg-gray-50 p-1.5 border border-gray-200 rounded text-sm"
                  placeholder="Address Line 2 (Optional)"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...(prev.address || {}), line2: e.target.value },
                    }))
                  }
                  value={userData.address?.line2 || ""}
                  type="text"
                />
              </div>
            ) : (
              <p className="text-gray-500">
                {userData.address?.line1}
                {userData.address?.line2 && (
                  <>
                    <br />
                    {userData.address?.line2}
                  </>
                )}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender}</p>
            )}
            
            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="date"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={userData.dob}
              />
            ) : (
              <p className="text-gray-400">{userData.dob}</p>
            )}

            <p className="font-medium">Age:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="number"
                placeholder="Age"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, age: e.target.value }))
                }
                value={userData.age || ""}
              />
            ) : (
              <p className="text-gray-400">{userData.age || "-"}</p>
            )}

            <p className="font-medium">Blood Group:</p>
            {isEdit ? (
              <select
                className="max-w-28 bg-gray-100"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, bloodGroup: e.target.value }))
                }
                value={userData.bloodGroup || "Not Selected"}
              >
                <option value="Not Selected">Not Selected</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.bloodGroup || "Not Selected"}</p>
            )}

            <p className="font-medium">Height:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="text"
                placeholder="e.g. 5'9 or 175cm"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, height: e.target.value }))
                }
                value={userData.height || ""}
              />
            ) : (
              <p className="text-gray-400">{userData.height || "-"}</p>
            )}

            <p className="font-medium">Weight:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="text"
                placeholder="e.g. 70kg or 150lbs"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, weight: e.target.value }))
                }
                value={userData.weight || ""}
              />
            ) : (
              <p className="text-gray-400">{userData.weight || "-"}</p>
            )}
          </div>
        </div>

        <div>
           <p className="text-neutral-500 underline mt-5">LIFESTYLE PROFILE</p>
           <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-y-4 gap-x-2 mt-3 text-neutral-700 items-center">
             
             <p className="font-medium text-sm">1. What type of diet do you follow?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, dietType: e.target.value}))} value={userData.dietType || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Vegetarian">Vegetarian</option>
                 <option value="Vegan">Vegan</option>
                 <option value="Non-Vegetarian">Non-Vegetarian</option>
                 <option value="Diabetic">Diabetic</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.dietType || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">2. Are you allergies with any food items?</p>
             {isEdit ? (
               <div className="flex flex-col gap-2">
                 <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, foodAllergies: e.target.value}))} value={userData.foodAllergies || "Not Selected"}>
                   <option value="Not Selected">Not Selected</option>
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                 </select>
                 {userData.foodAllergies === "Yes" && (
                   <textarea
                     className="w-full bg-gray-50 p-2 border rounded text-xs"
                     placeholder="Please provide details about your food allergies..."
                     onChange={(e) => setUserData(prev => ({...prev, foodAllergiesDetail: e.target.value}))}
                     value={userData.foodAllergiesDetail || ""}
                   />
                 )}
               </div>
             ) : (
               <div className="flex flex-col">
                 <p className="text-gray-500 font-light">{userData.foodAllergies || "Not Selected"}</p>
                 {userData.foodAllergies === "Yes" && userData.foodAllergiesDetail && (
                   <p className="text-xs text-gray-400 mt-1 italic">"{userData.foodAllergiesDetail}"</p>
                 )}
               </div>
             )}
 
             <p className="font-medium text-sm">3. Do you consume alcohol?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, alcoholConsumption: e.target.value}))} value={userData.alcoholConsumption || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="None">None</option>
                 <option value="Occasional">Occasional</option>
                 <option value="Frequent">Frequent</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.alcoholConsumption || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">4. Do you have irresistible sugar or refined carbohydrate cravings?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, sugarCravings: e.target.value}))} value={userData.sugarCravings || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Yes">Yes</option>
                 <option value="No">No</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.sugarCravings || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">5. How would you describe your daily routine?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, dailyRoutine: e.target.value}))} value={userData.dailyRoutine || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Sedentary (Mostly sitting)">Sedentary (Mostly sitting)</option>
                 <option value="Moderately Active (Regular movement)">Moderately Active (Regular movement)</option>
                 <option value="Highly Active (Physical labor or heavy exercise)">Highly Active (Physical labor or heavy exercise)</option>
                 <option value="Travel frequently">Travel frequently</option>
                 <option value="Irregular shift/schedule">Irregular shift/schedule</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.dailyRoutine || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">6. Do you get fatigued often?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, fatigueOften: e.target.value}))} value={userData.fatigueOften || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Yes">Yes</option>
                 <option value="No">No</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.fatigueOften || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">7. How frequently do you exercise?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, exerciseFrequency: e.target.value}))} value={userData.exerciseFrequency || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Exercise on most days">Exercise on most days</option>
                 <option value="Don't exercise regularly">Don't exercise regularly</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.exerciseFrequency || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">8. How is your sleep pattern?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, sleepPattern: e.target.value}))} value={userData.sleepPattern || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Get good sleep">Get good sleep</option>
                 <option value="Don't often get enough sleep">Don't often get enough sleep</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.sleepPattern || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">9. How often do you experience high levels of stress?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, stressCoping: e.target.value}))} value={userData.stressCoping || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Rarely">Rarely</option>
                 <option value="Sometimes">Sometimes</option>
                 <option value="Chronically/Frequently">Chronically/Frequently</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.stressCoping || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">10. How frequently do you get flu/viral infections?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, fluFrequency: e.target.value}))} value={userData.fluFrequency || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Seasonal flu">Seasonal flu</option>
                 <option value="Very frequently">Very frequently</option>
                 <option value="Very rare">Very rare</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.fluFrequency || "Not Selected"}</p>}
 
             <p className="font-medium text-sm">11. If you are consuming any medication on a daily basis, please provide the details.</p>
             {isEdit ? (
               <div className="flex flex-col gap-2">
                 <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, dailyMedication: e.target.value}))} value={userData.dailyMedication || "Not Selected"}>
                   <option value="Not Selected">Not Selected</option>
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                 </select>
                 {userData.dailyMedication === "Yes" && (
                   <textarea
                     className="w-full bg-gray-50 p-2 border rounded text-xs"
                     placeholder="Please list your daily medications..."
                     onChange={(e) => setUserData(prev => ({...prev, dailyMedicationDetail: e.target.value}))}
                     value={userData.dailyMedicationDetail || ""}
                   />
                 )}
               </div>
             ) : (
               <div className="flex flex-col">
                 <p className="text-gray-500 font-light">{userData.dailyMedication || "Not Selected"}</p>
                 {userData.dailyMedication === "Yes" && userData.dailyMedicationDetail && (
                   <p className="text-xs text-gray-400 mt-1 italic">"{userData.dailyMedicationDetail}"</p>
                 )}
               </div>
             )}
 
             <p className="font-medium text-sm">12. What is your smoking status?</p>
             {isEdit ? (
               <select className="max-w-full bg-gray-100 p-2" onChange={(e) => setUserData(prev => ({...prev, smokingStatus: e.target.value}))} value={userData.smokingStatus || "Not Selected"}>
                 <option value="Not Selected">Not Selected</option>
                 <option value="Non-smoker">Non-smoker</option>
                 <option value="Former smoker">Former smoker</option>
                 <option value="Current smoker">Current smoker</option>
               </select>
             ) : <p className="text-gray-500 font-light">{userData.smokingStatus || "Not Selected"}</p>}
             
           </div>
         </div>

         <div>
          <p className="text-neutral-500 underline mt-5">HOW ARE YOU FEELING?</p>
          <div className="mt-3 text-neutral-700">
            {isEdit ? (
              <textarea
                className="w-full bg-gray-50 p-3 border rounded border-gray-200"
                rows="3"
                placeholder="How are you feeling? (This helps your doctor prepare for your consultation)"
                value={userData.feeling || ""}
                onChange={(e) => setUserData((prev) => ({ ...prev, feeling: e.target.value }))}
              ></textarea>
            ) : (
              <p className="text-gray-500 bg-gray-50 p-4 rounded italic border border-gray-100">
                {userData.feeling || "No response provided."}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-neutral-500 underline mb-4">HEALTH RECORDS</p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <form onSubmit={handleUploadRecord} className="flex gap-2 items-center mb-6">
              <input
                type="text"
                placeholder="Document Title (e.g. Blood Test Report)"
                value={recordTitle}
                onChange={(e) => setRecordTitle(e.target.value)}
                className="flex-1 p-2 border rounded text-sm"
                required
              />
              <input
                type="file"
                onChange={(e) => setRecordFile(e.target.files[0])}
                className="text-sm p-1"
                required
              />
              <button
                type="submit"
                disabled={uploadingRecord}
                className={`px-4 py-2 bg-primary text-white text-sm rounded transition-all ${uploadingRecord ? 'opacity-50' : 'hover:bg-blue-600'}`}
              >
                {uploadingRecord ? 'Uploading...' : 'Upload'}
              </button>
            </form>

            {healthRecords.length > 0 ? (
              <div className="flex flex-col gap-3">
                {healthRecords.map((record) => (
                  <div key={record._id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{record.title}</span>
                      <span className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`${backendUrl}/api/user/view-record/${record._id}?token=${token}`, '_blank')}
                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-all cursor-pointer"
                      >
                        View Document
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record._id)}
                        className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-4">No health records uploaded yet.</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isEdit ? (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={updateUserProfileData}
            >
              Save information
            </button>
          ) : (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
