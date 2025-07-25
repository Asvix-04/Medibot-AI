//ChatMessage
import React, { useState, useEffect } from "react";
import { FaEdit, FaRegCopy, FaThumbsUp, FaThumbsDown, FaVolumeUp } from "react-icons/fa";
import medibot_logo from "../../assets/medibot_logo.jpg";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ChatMessage = ({ message, onEditSubmit, darkMode }) => {
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
      {isBot && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-[#1a1a1a] border border-[#2a2a2a] mr-2">
          <img src={medibot_logo} alt="Medibot" className="h-8 w-8 rounded-full" />
        </div>
      )}

      <div className="max-w-[85%] relative flex flex-col space-y-3">
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

        <div
          className={`rounded-lg px-4 py-2 shadow-sm relative leading-relaxed ${isBot
            ? `${darkMode ? 'bg-gray-300/20 text-[#d6d4d4]' : 'bg-gray-300/20 text-[#0e0e0eee]'}`
            : `${darkMode ? 'bg-[#14254E] text-[#e8e2e7]' : 'bg-blue-600/20 text-[#0a0a0a]'}`
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
                className="flex h-10 w-full border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-gray-100 dark:bg-gray-700 border-none dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                autoFocus
              />
              <div className="flex space-x-2">
                <button onClick={handleSave} className=" text-white px-2 py-1 rounded">Save</button>
                <button onClick={handleCancel} className=" text-white px-2 py-1 rounded">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <p className="whitespace-pre-wrap">{message.content}</p>

              {/* Icons and Timestamp */}
              <div className="flex items-center space-x-4 mt-3 text-[#a8a8a8]">
                {!isBot && (
                  <>
                    <FaRegCopy className="cursor-pointer text-gray-500 dark:text-gray-400" title="Copy" onClick={handleCopy} />
                    <FaEdit className="cursor-pointer text-gray-500 dark:text-gray-400" title="Edit" onClick={() => setIsEditing(true)} />
                  </>
                )}
                {isBot && (
                  <>
                    <FaThumbsUp className="cursor-pointer" title="Thumbs Up" onClick={handleThumbsUp} />
                    <FaThumbsDown className="cursor-pointer" title="Thumbs Down" onClick={handleThumbsDown} />
                    <FaVolumeUp className="cursor-pointer" title="Read Aloud" onClick={handleReadAloud} />
                  </>
                )}
              </div>
              <div className="self-end text-xs text-gray-500 dark:text-gray-400 mt-1">{dayjs(message.timestamp).format("DD MMM YYYY, hh:mm a")}</div>
            </div>
          )}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center dark:bg-blue-600 bg-[#7f7fe0] border border-[#181c54] ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d6d4d4]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
