//ChatMessage
import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaRegCopy,
  FaThumbsUp,
  FaThumbsDown,
  FaVolumeUp,
} from "react-icons/fa";
import medibot_logo from "../../assets/medibot_logo.jpg";

/**
 * ChatMessage Component
 *
 * Renders an individual chat message bubble.
 * Supports:
 * - User message editing and copying
 * - Bot message feedback (thumbs up/down)
 * - Bot message read-aloud using Web Speech API
 */

const ChatMessage = ({ message, onEditSubmit }) => {
  const isBot = message.role === "bot";

  // Local states
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);

  // Sync editedText with prop changes
  useEffect(() => {
    setEditedText(message.content);
  }, [message.content]);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    console.log("Copied to clipboard:", message.content);
  };

  // Save edited text
  const handleSave = () => {
    if (onEditSubmit) {
      onEditSubmit(message.id, editedText);
    }
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedText(message.content);
    setIsEditing(false);
  };

  // Feedback handlers
  const handleThumbsUp = () => {
    console.log("Feedback: 👍 Good response for message ID", message.id);
  };

  const handleThumbsDown = () => {
    console.log("Feedback: 👎 Bad response for message ID", message.id);
  };

  // Read aloud
  const handleReadAloud = () => {
    const utterance = new SpeechSynthesisUtterance(message.content);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex items-start ${isBot ? "" : "justify-end"} my-2`}>
      {/* BOT Avatar */}
      {isBot && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] mr-2">
          <img
            src={medibot_logo}
            alt="Medibot"
            className="h-8 w-8 rounded-full"
          />
        </div>
      )}

      {/* Message Bubble */}
      <div className="max-w-[85%]">
        <div
          className={`relative rounded-lg px-4 py-2 shadow-sm ${
            isBot
              ? "bg-[#1a1a1a] text-[#d6d4d4] border border-[#2a2a2a]"
              : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-[#d6d4d4]"
          }`}
          onMouseEnter={() => !isBot && setIsHovering(true)}
          onMouseLeave={() => !isBot && setIsHovering(false)}
        >
          {isEditing ? (
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="text-black p-2 rounded border border-gray-300"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Icons for user messages */}
          {!isBot && isHovering && !isEditing && (
            <div className="absolute top-10 right-2 flex space-x-2">
              <FaEdit
                className="text-gray-600 cursor-pointer"
                title="Edit"
                onClick={() => setIsEditing(true)}
              />
              <FaRegCopy
                className="text-gray-600 cursor-pointer"
                title="Copy"
                onClick={handleCopy}
              />
            </div>
          )}
        </div>
        {/* new code */}
        {message.file && (
          <div className="mt-3">
            {message.file.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(message.file)}
                alt="uploaded preview"
                className="w-40 h-auto rounded shadow"
              />
            ) : (
              <a
                href={URL.createObjectURL(message.file)}
                download={message.file.name}
                className="text-blue-500 underline text-sm"
              >
                📎 {message.file.name}
              </a>
            )}
          </div>
        )}
        {/* new code */}
        {/* Feedback + Read Aloud Buttons for BOT */}
        {isBot && !isEditing && (
          <div className="flex space-x-4 mt-2 text-[#a8a8a8]">
            <button
              onClick={handleThumbsUp}
              title="Good Response"
              className="hover:text-black transition-colors"
            >
              <FaThumbsUp />
            </button>
            <button
              onClick={handleThumbsDown}
              title="Bad Response"
              className="hover:text-black  transition-colors"
            >
              <FaThumbsDown />
            </button>
            <button
              onClick={handleReadAloud}
              title="Read Aloud"
              className="hover:text-blue-400 transition-colors"
            >
              <FaVolumeUp />
            </button>
          </div>
        )}
      </div>

      {/* USER Avatar */}
      {!isBot && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#d6d4d4]"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
