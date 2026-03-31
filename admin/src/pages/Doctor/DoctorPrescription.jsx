import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorPrescription = () => {
    const { appointmentId } = useParams();
    const { dToken, backendUrl } = useContext(DoctorContext);
    const navigate = useNavigate();

    const [medicines, setMedicines] = useState([
        { name: "", dosage: "", frequency: "", duration: "", timing: "" }
    ]);
    const [instructions, setInstructions] = useState("");
    const [existingPrescription, setExistingPrescription] = useState(null);

    useEffect(() => {
        if (dToken) {
            fetchPrescription();
        }
    }, [dToken, appointmentId]);

    const fetchPrescription = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/doctor/prescription",
                { headers: { dToken }, params: { appointmentId } }
            );
            if (data.success && data.prescription) {
                setExistingPrescription(data.prescription);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...medicines];
        updatedMedicines[index][field] = value;
        setMedicines(updatedMedicines);
    };

    const addMedicine = () => {
        setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", timing: "" }]);
    };

    const removeMedicine = (index) => {
        const updatedMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(updatedMedicines);
    };

    const submitPrescription = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                backendUrl + "/api/doctor/create-prescription",
                {
                    appointmentId,
                    medicines,
                    instructions
                },
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                navigate("/doctor-appointments");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to create prescription");
        }
    };

    if (existingPrescription) {
        return (
            <div className="m-5 w-full bg-white p-6 rounded-lg shadow-sm border border-stone-200">
                <h2 className="text-2xl font-semibold text-primary mb-4">Prescription Details</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                    <p className="font-semibold text-gray-700">Instructions / Notes:</p>
                    <p className="text-gray-600 mt-1">{existingPrescription.instructions || "None"}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr>
                                <th className="px-4 py-3 border-b">Medicine Name</th>
                                <th className="px-4 py-3 border-b">Dosage</th>
                                <th className="px-4 py-3 border-b">Frequency</th>
                                <th className="px-4 py-3 border-b">Duration</th>
                                <th className="px-4 py-3 border-b">Timing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {existingPrescription.medicines.map((med, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{med.name}</td>
                                    <td className="px-4 py-3">{med.dosage}</td>
                                    <td className="px-4 py-3">{med.frequency}</td>
                                    <td className="px-4 py-3">{med.duration}</td>
                                    <td className="px-4 py-3">{med.timing}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="m-5 w-full max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-stone-200">
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Write Prescription</h2>

            <form onSubmit={submitPrescription}>
                <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-3 border-b pb-2">Medicines</h3>
                    {medicines.map((med, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4 items-center bg-gray-50 p-3 rounded border">
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-500 mb-1 block">Medicine Name</label>
                                <input required value={med.name} onChange={(e) => handleMedicineChange(index, "name", e.target.value)} type="text" placeholder="e.g. Paracetamol" className="w-full p-2 border rounded text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Dosage</label>
                                <input required value={med.dosage} onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)} type="text" placeholder="e.g. 500mg" className="w-full p-2 border rounded text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Frequency</label>
                                <input required value={med.frequency} onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)} type="text" placeholder="e.g. 1-0-1" className="w-full p-2 border rounded text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Duration</label>
                                <input required value={med.duration} onChange={(e) => handleMedicineChange(index, "duration", e.target.value)} type="text" placeholder="e.g. 5 Days" className="w-full p-2 border rounded text-sm" />
                            </div>
                            <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Timing</label>
                                    <select required value={med.timing} onChange={(e) => handleMedicineChange(index, "timing", e.target.value)} className="w-full p-2 border rounded text-sm bg-white">
                                        <option value="">Select</option>
                                        <option value="After Food">After Food</option>
                                        <option value="Before Food">Before Food</option>
                                        <option value="Empty Stomach">Empty Stomach</option>
                                        <option value="Anytime">Anytime</option>
                                    </select>
                                </div>
                                {index > 0 && (
                                    <button type="button" onClick={() => removeMedicine(index)} className="p-2 text-red-500 bg-red-50 rounded hover:bg-red-100 mb-[1px]">
                                        X
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addMedicine} className="text-sm text-primary font-medium hover:underline">+ Add Another Medicine</button>
                </div>

                <div className="mb-6">
                    <label className="font-medium text-gray-700 mb-2 block">General Instructions / Notes</label>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        rows="4"
                        placeholder="E.g., Drink plenty of water. Avoid cold food."
                        className="w-full p-3 border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                    ></textarea>
                </div>

                <div className="flex gap-4">
                    <button type="submit" className="bg-primary text-white px-8 py-2.5 rounded-full hover:bg-blue-600 transition-all shadow-sm">
                        Save Prescription
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="px-8 py-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DoctorPrescription;
