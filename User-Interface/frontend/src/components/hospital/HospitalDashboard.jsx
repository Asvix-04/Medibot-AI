import React from "react";
import { Link } from "react-router-dom";
import {
  FlaskConical,
  CalendarCheck,
  FileText,
  MessageSquareText,
  BarChart3,
  Lightbulb,
  UserCheck,
  ThumbsUp
} from "lucide-react"; // Example icons

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

const HospitalDashboard = () => {
  return (
    <div className="bg-[#0B0B0F] min-h-screen py-12 px-4 sm:px-6 lg:px-16 text-white">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-400">
          🏥 Hospital Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Manage all hospital activities in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <DashboardTile
          icon={FlaskConical}
          title="Medication Management"
          description="Set up and review prescriptions and pharmacy alerts."
          to="/hospital/medications"
        />
        <DashboardTile
          icon={BarChart3}
          title="Health Tracking"
          description="Monitor patient vitals and lab results across departments."
          to="/health-dashboard"
        />
        <DashboardTile
          icon={CalendarCheck}
          title="Manage Appointments"
          description="View and organize your upcoming patient appointments."
          to="/doctor/appointments"
        />
        <DashboardTile
          icon={FileText}
          title="Medical Records"
          description="Access and update hospital-wide medical documentation."
          to="/health-dashboard"
        />
        <DashboardTile
          icon={MessageSquareText}
          title="Health Chat Assistant"
          description="Respond to patient queries using our AI assistant."
          to="/chat"
        />
         <DashboardTile
          icon={UserCheck}
          title="Manage Profile"
          description="Update your doctor profile and availability settings."
          to="/hospital/list"
        />
        <DashboardTile
          icon={ThumbsUp}
          title="Patient Feedback"
          description="Collect and review patient feedback to improve services."
          to="/hospital/feedback"
        />
      </div>
    </div>
  );
};

export default HospitalDashboard;