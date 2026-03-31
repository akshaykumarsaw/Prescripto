import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Tooltip,
    XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#4f46e5", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#a855f7", "#ec4899"];

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${color} flex items-center gap-4`}>
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Analytics = () => {
    const { aToken, backendUrl } = useContext(AdminContext);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/admin/analytics", {
                headers: { aToken },
            });
            if (data.success) {
                setAnalytics(data.analytics);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (aToken) fetchAnalytics();
    }, [aToken]);

    if (loading) {
        return (
            <div className="m-5 w-full">
                <p className="text-lg font-medium mb-4 text-gray-700">Analytics Dashboard</p>
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl h-24 animate-pulse border shadow-sm" />
                    ))}
                </div>
                <div className="bg-white rounded-xl h-72 animate-pulse border shadow-sm mb-4" />
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="m-5 w-full max-w-6xl">
            <p className="text-lg font-medium mb-5 text-gray-700">📊 Analytics Dashboard</p>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Doctors" value={analytics.totalDoctors} icon="🩺" color="border-indigo-500" />
                <StatCard title="Total Patients" value={analytics.totalPatients} icon="👥" color="border-blue-500" />
                <StatCard title="Appointments" value={analytics.totalAppointments} icon="📅" color="border-emerald-500" />
                <StatCard title="Total Revenue" value={`₹${analytics.totalRevenue.toLocaleString()}`} icon="💰" color="border-amber-500" />
            </div>

            {/* Monthly Appointments Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-5 mb-5">
                <p className="font-semibold text-gray-700 mb-4">Monthly Appointments (Last 6 Months)</p>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={analytics.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="appointments" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Appointments" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Revenue Trend */}
            <div className="bg-white rounded-xl shadow-sm border p-5 mb-5">
                <p className="font-semibold text-gray-700 mb-4">Revenue Trend (₹) — Last 6 Months</p>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={analytics.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => `₹${v}`} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Revenue (₹)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Specialty Distribution */}
                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <p className="font-semibold text-gray-700 mb-4">Doctors by Specialty</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={analytics.specialtyData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {analytics.specialtyData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Appointment Status */}
                <div className="bg-white rounded-xl shadow-sm border p-5">
                    <p className="font-semibold text-gray-700 mb-4">Appointment Status Breakdown</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={analytics.statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                <Cell fill="#10b981" />
                                <Cell fill="#ef4444" />
                                <Cell fill="#f59e0b" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
