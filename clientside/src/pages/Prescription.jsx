import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Prescription = () => {
    const { appointmentId } = useParams();
    const { token, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchPrescription();
        }
    }, [token, appointmentId]);

    const fetchPrescription = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/user/prescriptions",
                { headers: { token } }
            );
            if (data.success) {
                // Find the specific prescription for this appointment
                const specPrescription = data.prescriptions.find(p => p.appointmentId === appointmentId);
                if (specPrescription) {
                    setPrescription(specPrescription);
                } else {
                    toast.error("No prescription found for this appointment.");
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        const input = document.getElementById("prescription-card");
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`prescription_${appointmentId}.pdf`);
        });
    };

    if (loading) {
        return <div className="text-center mt-20 text-gray-500">Loading prescription...</div>;
    }

    if (!prescription) {
        return (
            <div className="text-center mt-20">
                <p className="text-gray-500 mb-4">No prescription is available for this appointment yet.</p>
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-primary text-white rounded-full">Go Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto my-10 p-5">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                    ← Back
                </button>
                <button onClick={downloadPDF} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 shadow-sm flex items-center gap-2">
                    Download PDF
                </button>
            </div>

            {/* Printable Area */}
            <div id="prescription-card" className="bg-white p-8 md:p-12 rounded-xl shadow-md border border-gray-200 text-gray-800">
                <div className="flex justify-between items-start border-b pb-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <span className="bg-primary text-white px-2 py-1 rounded">P</span>
                            rescripto
                        </h1>
                        <p className="text-sm text-gray-500 mt-2">Trusted Healthcare, Anytime.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-sm">Date: {new Date(prescription.date).toLocaleDateString()}</p>
                        <p className="text-gray-500 text-sm">Appointment ID: {prescription.appointmentId.slice(-6).toUpperCase()}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4 uppercase tracking-wide">RX - Medications</h2>
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Medicine Name</th>
                                    <th className="px-4 py-3 font-medium">Dosage</th>
                                    <th className="px-4 py-3 font-medium">Frequency</th>
                                    <th className="px-4 py-3 font-medium">Duration</th>
                                    <th className="px-4 py-3 font-medium">Timing</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {prescription.medicines.map((med, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-800">{med.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{med.dosage}</td>
                                        <td className="px-4 py-3 text-gray-600">{med.frequency}</td>
                                        <td className="px-4 py-3 text-gray-600">{med.duration}</td>
                                        <td className="px-4 py-3 text-gray-600">{med.timing}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {prescription.instructions && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4 uppercase tracking-wide">General Instructions</h2>
                        <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm leading-relaxed whitespace-pre-line border border-blue-100">
                            {prescription.instructions}
                        </div>
                    </div>
                )}

                <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
                    <p>This is a computer-generated prescription. Valid without signature.</p>
                </div>
            </div>
        </div>
    );
};

export default Prescription;
