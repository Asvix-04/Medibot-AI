//chat input
import React, { useState, useRef } from "react";
import { FiPaperclip } from "react-icons/fi";
import {
  MdRecordVoiceOver,
  MdKeyboardVoice,
  MdSwapCalls,
} from "react-icons/md";
import { IoOptions } from "react-icons/io5";
import VoiceChat from "./VoiceChat";


const ChatInput = ({ onSendMessage, darkMode }) => {
  const [message, setMessage] = useState("");
  const [showTools, setShowTools] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    onSendMessage(message, selectedFile);

    setMessage("");
    setSelectedFile(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("File uploaded:", file.name);
    }
    // reset input value so selecting same file again works
    e.target.value = null;
  };
  const toolOptions = [
    {
      name: "Text To Speech",
      icon: MdRecordVoiceOver,
    },
    {
      name: "Speech To Text",
      icon: MdKeyboardVoice,
    },
    {
      name: "Speech To Speech",
      icon: MdSwapCalls,
    },
  ];
  const handleDictate = (text) => {
    setMessage((prev) => (prev ? prev + " " + text : text));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mx-auto px-3 sm:px-4 py-3 border-t dark:border-gray-800 bg-white dark:bg-[#121212] flex flex-col gap-3"
    >
      {/* Preview selected file */}
      {selectedFile && (
        <div className="mb-3 flex items-center gap-3 p-3 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
          {selectedFile.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              className="w-16 h-16 object-cover rounded"
            />
          ) : (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              📎 {selectedFile.name}
            </div>
          )}
          <button
            type="button"
            className="ml-auto text-red-500 text-sm"
            onClick={() => setSelectedFile(null)}
          >
            Remove
          </button>
        </div>
      )}

      {/* Text Area */}
      <div className="relative w-full">
        <textarea
          className="w-full p-4 rounded-lg resize-none border border-gray-300 dark:border-[#2a2a2a] sm:text-sm bg-gray-50 dark:bg-[#1e1e1e] text-gray-800 dark:text-[#d6d4d4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all"
          placeholder="Type your message here..."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="button"
          className="absolute right-3 top-3 sm:px-4 sm:py-2.5 text-gray-400 hover:text-[#6366f1] transition"
          onClick={() => setMessage("")}
          aria-label="Clear message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          {/* Upload File Button */}
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => fileInputRef.current.click()}
          >
            <FiPaperclip className="w-5 h-5" />
            <span className="text-sm sm:text-base">Add File</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            onChange={handleFileUpload}
          />

          {/* Tools Dropdown Button */}
          <div className="relative flex items-center gap-2">
            {/* Tools Button */}
            <button
              type="button"
              className="flex items-center gap-2 sm:px-4 sm:py-2.5 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => setShowTools((prev) => !prev)}
            >
              <IoOptions className="w-5 h-5" />
              <span className="text-sm sm:text-base">Tools</span>
            </button>

            {/* Inline Selected Tool Badge */}
            {selectedTool && (
              <span className="px-3 py-1 rounded-full text-sm bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-white flex items-center">
                {selectedTool}
                <button
                  onClick={() => setSelectedTool(null)}
                  className="ml-2 text-sm text-red-500 hover:text-red-700"
                  aria-label="Remove tool"
                >
                  ❌
                </button>
              </span>
            )}

            {/* Dropdown - opens ABOVE */}
            {showTools && (
              <div className="absolute left-0 bottom-full mb-2 w-44 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                <ul className="text-sm text-left text-gray-700 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700">
                  {toolOptions.map(({ name, icon: Icon }) => (
                    <li
                      key={name}
                      onClick={() => {
                        setSelectedTool(name);
                        setShowTools(false);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                        selectedTool === name
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-800 dark:text-white font-semibold"
                          : ""
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Send Button */}
        <div className="flex gap-2">
          <VoiceChat onDictate={handleDictate} darkMode={darkMode} />

          <button
            type="submit"
            disabled={!message.trim() && !selectedFile}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              message.trim() || selectedFile
                ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:shadow-md transition"
                : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800"
            }`}
          >
            Send
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
   
    </form>
  );
};

export default ChatInput;
