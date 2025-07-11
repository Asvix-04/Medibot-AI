// DoctorAppointmentManager.jsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TimeBlockManager from "./TimeBlockManager";
import AppointmentDetails from "./AppointmentDetails";

const DoctorAppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState("all");
  const [blockedTimes, setBlockedTimes] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("doctor-appointments") || "[]");
    const blocks = JSON.parse(localStorage.getItem("blockedTimes") || "[]");
    setAppointments(data);
    setBlockedTimes(blocks);
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const today = new Date().toISOString().split("T")[0];
    if (filter === "upcoming") return appt.date >= today;
    if (filter === "past") return appt.date < today;
    if (filter === "canceled") return appt.status === "Canceled";
    return true;
  });

  const handleAction = (id, type) => {
    const updated = appointments.map((appt) =>
      appt.id === id ? { ...appt, status: type } : appt
    );
    setAppointments(updated);
    localStorage.setItem("doctor-appointments", JSON.stringify(updated));
  };

  const isBlocked = (date, time) => {
    return blockedTimes.some((b) => b.date === date && b.time === time);
  };

  const exportToCSV = () => {
    const header = ["Patient", "Doctor", "Date", "Time", "Status"];
    const rows = appointments.map((a) => [a.name, a.doctorName, a.date, a.time, a.status]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "appointments.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDateSelect = (selectInfo) => {
    const date = selectInfo.startStr.split("T")[0];
    const time = selectInfo.startStr.split("T")[1]?.substring(0, 5) || "";
    if (isBlocked(date, time)) {
      alert("This time is blocked. Please choose a different time.");
    }
  };

  const handleEventDrop = (info) => {
    const id = info.event.extendedProps.id;
    const newDate = info.event.startStr.split("T")[0];
    const updated = appointments.map((appt) =>
      appt.id === id ? { ...appt, date: newDate } : appt
    );
    setAppointments(updated);
    localStorage.setItem("doctor-appointments", JSON.stringify(updated));
  };

  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        📆 Appointment Dashboard
      </h1>

      {/* Filters and CSV Export */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <select
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg w-full sm:w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="canceled">Canceled</option>
        </select>
        <button
          onClick={exportToCSV}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
        >
          ⬇️ Export CSV
        </button>
      </div>

      {/* Calendar */}
      <div className="mb-6 bg-white p-4 sm:p-8 rounded shadow overflow-x-auto">
        <FullCalendar
          className="w-full"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek"
          }}
          editable={true}
          selectable={true}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          events={appointments.map((a) => ({
            id: a.id,
            title: a.name + " - " + a.doctorName,
            date: a.date,
            backgroundColor: isBlocked(a.date, a.time) ? "#f87171" : undefined,
            extendedProps: a
          }))}
          eventClick={(info) => setSelectedAppointment(info.event.extendedProps)}
        />
      </div>

      {/* Appointment Table */}
      <div className="mb-6 bg-white p-4 sm:p-6 rounded shadow overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
          📋 Appointment List
        </h2>
        {filteredAppointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-sm">Patient</th>
                  <th className="p-2 text-sm">Doctor</th>
                  <th className="p-2 text-sm">Date</th>
                  <th className="p-2 text-sm">Time</th>
                  <th className="p-2 text-sm">Status</th>
                  <th className="p-2 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className={`border-t ${isBlocked(appt.date, appt.time) ? "bg-red-100" : ""}`}
                  >
                    <td className="p-2 text-sm">{appt.name}</td>
                    <td className="p-2 text-sm">{appt.doctorName}</td>
                    <td className="p-2 text-sm">{appt.date}</td>
                    <td className="p-2 text-sm">{appt.time}</td>
                    <td className="p-2 text-sm">{appt.status}</td>
                    <td className="p-2 space-y-1 space-x-1 text-sm">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleAction(appt.id, "Confirmed")}
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleAction(appt.id, "Rescheduled")}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleAction(appt.id, "Canceled")}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAction(appt.id, "Completed")}
                          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleAction(appt.id, "Follow-Up")}
                          className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Follow Up
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Time Block Manager */}
      <TimeBlockManager />

      {/* Appointment Modal */}
      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default DoctorAppointmentManager;
