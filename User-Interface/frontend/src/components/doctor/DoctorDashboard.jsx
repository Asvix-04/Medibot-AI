import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  LineChart,
  NotebookText,
  ClipboardCheck,
  UserCheck,
  MessageSquareHeart
} from "lucide-react";

const DashboardTile = ({ icon: Icon, title, description, to }) => (
  <Link
    to={to}
    className="bg-[#121212] border border-[#2A2A35] hover:border-indigo-500 rounded-2xl p-6 transition duration-300 shadow-md hover:shadow-xl flex flex-col items-start gap-3"
  >
    <Icon className="text-indigo-400 w-6 h-6" />
    <h3 className="text-indigo-400 font-bold text-lg">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </Link>
);

const DoctorDashboard = () => {
  return (
    <div className="bg-[#0B0B0F] min-h-screen py-12 px-4 sm:px-6 lg:px-16 text-white">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
          🩺 Doctor Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Access tools and insights to manage your practice efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardTile
          icon={CalendarCheck}
          title="Manage Appointments"
          description="View and organize your upcoming patient appointments."
          to="/doctor/appointments"
        />
        <DashboardTile
          icon={LineChart}
          title="View Analytics"
          description="Track patient trends and treatment effectiveness."
          to="/doctor/analytics"
        />
        <DashboardTile
          icon={NotebookText}
          title="Medical Notes"
          description="Write and review case notes and treatment plans."
          to="/doctor/notes"
        />
        <DashboardTile
          icon={ClipboardCheck}
          title="Patient Records"
          description="Access detailed patient medical history and reports."
          to="/doctor/records"
        />
        <DashboardTile
          icon={UserCheck}
          title="Manage Profile"
          description="Update your doctor profile and availability settings."
          to="/doctor/list"
        />
        <DashboardTile
          icon={MessageSquareHeart}
          title="AI Assistant"
          description="Get smart suggestions and summaries from patient data."
          to="/chat"
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;
