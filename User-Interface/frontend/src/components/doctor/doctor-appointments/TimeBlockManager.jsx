// TimeBlockManager.jsx
import React, { useState, useEffect } from "react";

const TimeBlockManager = () => {
  const [blocks, setBlocks] = useState(() => {
    const saved = localStorage.getItem("blockedTimes");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ date: "", time: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBlock = () => {
    if (!form.date || !form.time) return;
    const updated = [...blocks, form];
    setBlocks(updated);
    localStorage.setItem("blockedTimes", JSON.stringify(updated));
    setForm({ date: "", time: "" });
  };

  const handleRemoveBlock = (index) => {
    const updated = blocks.filter((_, i) => i !== index);
    setBlocks(updated);
    localStorage.setItem("blockedTimes", JSON.stringify(updated));
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow mt-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">⛔ Time Block Management</h2>

      {/* Input Form */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-4">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg w-full sm:w-auto"
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg w-full sm:w-auto"
        />
        <button
          onClick={handleAddBlock}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full sm:w-auto"
        >
          Block Time
        </button>
      </div>

      {/* List of Blocked Times */}
      {blocks.length > 0 && (
        <ul className="list-disc pl-4 sm:pl-6 space-y-1 text-sm sm:text-base">
          {blocks.map((b, i) => (
            <li key={i} className="flex justify-between items-center">
              <span>{b.date} at {b.time}</span>
              <button
                onClick={() => handleRemoveBlock(i)}
                className="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimeBlockManager;