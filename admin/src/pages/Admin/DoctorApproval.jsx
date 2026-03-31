import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorApproval = () => {
    const { aToken, backendUrl } = useContext(AdminContext);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/all-doctors",
                {},
                { headers: { aToken } }
            );
            if (data.success) {
                setDoctors(data.doctors);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (docId, isApproved) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/admin/set-doctor-approval",
                { docId, isApproved },
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                fetchDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (aToken) fetchDoctors();
    }, [aToken]);

    return (
        <div className="m-5 w-full max-w-5xl">
            <p className="text-lg font-medium mb-4 text-gray-700">Doctor Approval Management</p>

            {loading ? (
                <div className="flex flex-col gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border rounded-xl h-20 animate-pulse shadow-sm" />
                    ))}
                </div>
            ) : (
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Doctor</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Specialty</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Experience</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doc, index) => (
                                <tr key={doc._id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img src={doc.image} alt="" className="w-9 h-9 rounded-full object-cover border" />
                                            <div>
                                                <p className="font-medium text-gray-800">{doc.name}</p>
                                                <p className="text-xs text-gray-400">{doc.degree}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{doc.speciality}</td>
                                    <td className="py-3 px-4 text-gray-600">{doc.experience}</td>
                                    <td className="py-3 px-4">
                                        <span className="font-medium text-amber-500">
                                            ⭐ {doc.rating ? doc.rating.toFixed(1) : "0.0"}
                                        </span>
                                        <span className="text-xs text-gray-400 ml-1">
                                            ({doc.reviews ? doc.reviews.length : 0})
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        {doc.isApproved === false ? (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                                                Rejected
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full font-medium">
                                                Approved
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            {doc.isApproved === false ? (
                                                <button
                                                    onClick={() => handleApproval(doc._id, true)}
                                                    className="px-3 py-1 text-xs bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-500 hover:text-white transition-all font-medium"
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleApproval(doc._id, false)}
                                                    className="px-3 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-500 hover:text-white transition-all font-medium"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {doctors.length === 0 && (
                        <p className="text-center text-gray-400 py-8 text-sm">No doctors found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorApproval;
