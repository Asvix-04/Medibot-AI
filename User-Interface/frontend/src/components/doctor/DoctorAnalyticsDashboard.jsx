import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DoctorAnalyticsDashboard = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("doctor-appointments") || "[]");
        setAppointments(stored);
    }, []);

    const totalPatients = new Set(appointments.map(a => a.name)).size;

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week
    const thisWeekAppointments = appointments.filter(a => {
        const apptDate = new Date(a.date);
        return apptDate >= weekStart && apptDate <= today;
    }).length;

    const avgConsultTime = appointments.length
        ? Math.round(appointments.reduce((sum, a) => sum + (parseInt(a.duration || 15)), 0) / appointments.length) + " min"
        : "N/A";

    const revenue = "₹" + appointments.length * 500;

    // Line chart data - sample weekly grouping

    const groupAppointmentsByWeek = (appointments) => {
        const weeks = [0, 0, 0, 0, 0]; // Up to 5 weeks in a month

        appointments.forEach((appt) => {
            const date = new Date(appt.date);
            if (!isNaN(date)) {
                const weekIndex = Math.floor((date.getDate() - 1) / 7); // Week 0 to Week 4
                weeks[weekIndex]++;
            }
        });

        return weeks.slice(0, 4);
    }

    const lineData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Appointments",
                data: groupAppointmentsByWeek(appointments),
                borderColor: "#6366F1",
                backgroundColor: "#A5B4FC",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // Pie chart: Age group (if available)
    const ageGroups = { "0-18": 0, "19-35": 0, "36-50": 0, "51+": 0 };
    appointments.forEach((a) => {
        const age = parseInt(a.age);
        if (!isNaN(age)) {
            if (age <= 18) ageGroups["0-18"]++;
            else if (age <= 35) ageGroups["19-35"]++;
            else if (age <= 50) ageGroups["36-50"]++;
            else ageGroups["51+"]++;
        }
    });

    const pieData = {
        labels: Object.keys(ageGroups),
        datasets: [
            {
                data: Object.values(ageGroups),
                backgroundColor: ["#60A5FA", "#FBBF24", "#34D399", "#F87171"],
            },
        ],
    };

    // Bar chart: Appointment types
    const newTypes = ["Confirmed", "Rescheduled", "Canceled", "Completed"];
    const typeCounts = { New: 0, "Follow-up": 0 };

    appointments.forEach((a) => {
        if (newTypes.includes(a.status)) {
            typeCounts["New"]++;
        } else {
            typeCounts["Follow-up"]++;
        }
    });

    const barData = {
        labels: ["New Patient", "Follow-up"],
        datasets: [
            {
                label: "Appointments",
                data: [typeCounts["New"], typeCounts["Follow-up"]],
                backgroundColor: ["#10B981", "#6366F1"],
            },
        ],
    };

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">Doctor Analytics Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white p-4 rounded shadow text-center">
                    <h2 className="text-sm text-gray-500">Total Patients</h2>
                    <p className="text-2xl font-bold">{totalPatients}</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                    <h2 className="text-sm text-gray-500">Appointments This Week</h2>
                    <p className="text-2xl font-bold">{thisWeekAppointments}</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                    <h2 className="text-sm text-gray-500">Avg Consultation Time</h2>
                    <p className="text-2xl font-bold">{avgConsultTime}</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                    <h2 className="text-sm text-gray-500">Monthly Revenue</h2>
                    <p className="text-2xl font-bold">{revenue}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow w-full h-80 relative">
                    <h3 className="text-lg font-semibold mb-2">Appointments Over Time</h3>
                    <div className="absolute inset-0 top-10 p-2">
                        <Line data={lineData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow w-full h-80 relative">
                    <h3 className="text-lg font-semibold mb-2">Patient Demographics</h3>
                    <div className="absolute inset-0 top-10 p-2">
                        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow lg:col-span-2 w-full h-80 relative">
                    <h3 className="text-lg font-semibold mb-2">Appointment Types</h3>
                    <div className="absolute inset-0 top-10 p-2">
                        <Bar data={barData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorAnalyticsDashboard;
