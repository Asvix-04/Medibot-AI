import React, { useEffect, useRef, useState } from "react";
import {
  FiSend,
  FiEdit2,
  FiCheck,
  FiX,
  FiCopy,
  FiVolume2,
} from "react-icons/fi";
import { BsReply } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";

export default function DoctorMessagingHub() {
  // Conversation starts with no doctor message, only patient response happens as replies
  const [conversations, setConversations] = useState([
    {
      id: 1,
      patientName: "John Doe",
      lastMessage: "Hello doctor my name is and I need help",
      timestamp: "10:00 AM",
      messages: [
        {
          id: 1,
          from: "patient",
          text: "Hello doctor my name is and I need help",
          time: "10:00 AM",
        },
      ],
    },
    {
      id: 2,
      patientName: "Jane Smith",
      lastMessage: "Thanks for your help doctor",
      timestamp: "11:15 AM",
      messages: [
        {
          id: 1,
          from: "patient",
          text: "Thanks for your help doctor",
          time: "11:15 AM",
        },
      ],
    },
    {
      id: 3,
      patientName: "Alex Johnson",
      lastMessage: "I'm having a headache.",
      timestamp: "1:20 PM",
      messages: [
        {
          id: 1,
          from: "patient",
          text: "I'm having a headache.",
          time: "1:20 PM",
        },
      ],
    },
    {
      id: 4,
      patientName: "Emily Davis",
      lastMessage: "Hello doctor my name is and I need help",
      timestamp: "9:40 AM",
      messages: [
        {
          id: 1,
          from: "patient",
          text: "Hello doctor my name is and I need help",
          time: "9:40 AM",
        },
      ],
    },
    {
      id: 5,
      patientName: "Michael Brown",
      lastMessage: "Thanks for your help doctor",
      timestamp: "3:05 PM",
      messages: [
        {
          id: 1,
          from: "patient",
          text: "Thanks for your help doctor",
          time: "3:05 PM",
        },
      ],
    },
  ]);
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageText, setEditingMessageText] = useState("");

  // for auto-scroll
  const messagesEndRef = useRef(null);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  // Define patient static responses in order
  const patientResponses = [
    "Hello doctor my name is and I need help",
    "I'm having a headache.",
    "Thanks for your help doctor",
  ];

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation.messages]);

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
    setEditingMessageId(null);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create new doctor message
    const newDoctorMessage = {
      id: Date.now(),
      from: "doctor",
      text: newMessage.trim(),
      time,
      replyTo: replyToMessage ? replyToMessage.text : null,
    };
    setReplyToMessage(null);
    setNewMessage("");

    // Count existing doctor messages
    const doctorMessageCount = selectedConversation.messages.filter(
      (m) => m.from === "doctor"
    ).length;

    let patientReplyText = "";
    if (doctorMessageCount === 1) {
      patientReplyText = patientResponses[1];
    } else if (doctorMessageCount === 2) {
      patientReplyText = patientResponses[1];
    } else {
      patientReplyText = patientResponses[2];
    }

    // Create new patient message
    const newPatientMessage = {
      id: Date.now() + 1,
      from: "patient",
      text: patientReplyText,
      time,
    };

    // Update conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              lastMessage: patientReplyText,
              timestamp: time,
              messages: [...conv.messages, newDoctorMessage, newPatientMessage],
            }
          : conv
      )
    );

    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartEditing = (msg) => {
    setEditingMessageId(msg.id);
    setEditingMessageText(msg.text);
  };

  const handleSaveEdit = () => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === editingMessageId
                  ? { ...m, text: editingMessageText }
                  : m
              ),
            }
          : conv
      )
    );
    setEditingMessageId(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleCopyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleReadAloud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };
  // Color Palettes
  const [selectedTheme, setSelectedTheme] = useState("default");
  const themeClasses = {
    default: {
      header:
        "bg-gradient-to-r from-[#6366f1] via-[#7b4ee5] to-[#8b5cf6] text-white shadow-lg shadow-purple-900/80",

      mainBg:
        "bg-gradient-to-br from-[#f8f7ff] via-[#ece9fe] to-[#f8f7ff] shadow-inner shadow-purple-100/30",

      sideBarBg:
        "bg-gradient-to-br from-[#eaeef7] via-[#f1ebfd] to-[#eaeef7] shadow-inner shadow-purple-100/40",

      sidebarHeader:
        "bg-gradient-to-r from-[#6366f1] via-[#714ff0] to-[#8b5cf6] text-white shadow-md shadow-purple-800/80",

      sidebarActiveChat:
        "bg-gradient-to-r from-[#f3eeff] via-[#ece9fe] to-[#f3eeff] shadow shadow-purple-300/50 border border-[#d6c9f7]",

      sideBarHover:
        "hover:bg-gradient-to-r hover:from-[#eae8f7] hover:via-[#e0dcf6] hover:to-[#eae8f7] hover:text-black",

      replyToMessage:
        "bg-gradient-to-r from-[#99AFDE] via-[#b3c3f2] to-[#99AFDE] border border-white text-white shadow-md shadow-purple-200/50",

      messageDoctor:
        "bg-gradient-to-r from-[#6366f1] via-[#7b4ee5] to-[#8b5cf6] text-white shadow-lg shadow-purple-800/70",

      messagePatient:
        "bg-gradient-to-r from-[#7D97D4] via-[#b09ae9] to-[#7D97D4] text-white border border-[#a78bfa] shadow-lg shadow-purple-400/50",

      input:
        "bg-gradient-to-br from-[#1F2937] via-[#2b3450] to-[#1F2937] text-[#d6d4d4] border-[#2a2a2a] shadow-inner shadow-[#111827]/70",

      iconBg: "text-white",

      sendButton:
        "bg-gradient-to-r from-[#7b4ee5] via-[#8e69e4] to-[#a78bfa] hover:from-[#8e69e4] hover:to-[#9d7ef5] text-white shadow-xl shadow-purple-400/50",
    },

    darkRoyalBlue: {
      header:
        "bg-gradient-to-r from-[#0a1f44] via-[#24487D] to-[#153060] text-[#e0e6f1] shadow-lg shadow-blue-900/80",

      mainBg:
        "bg-gradient-to-br from-[#EDF5FF] via-[#DAE4F5] to-[#b9d2f0] shadow-inner shadow-blue-100/30",

      sideBarBg:
        "bg-gradient-to-br from-[#DAE4F5] via-[#c8d8ee] to-[#EDF5FF] shadow-inner shadow-blue-100/40",

      sidebarHeader:
        "bg-gradient-to-r from-[#0a1f44] via-[#18335f] to-[#10294f] text-[#e0e6f1] shadow-md shadow-blue-800/80",

      sidebarActiveChat:
        "bg-gradient-to-r from-[#DAE2ED] via-[#c8d8ee] to-[#DAE2ED] shadow shadow-blue-300/50 border border-[#b9d2f0]",

      sideBarHover:
        "hover:bg-gradient-to-r hover:from-[#DFE3EB] hover:via-[#cfdce9] hover:to-[#DFE3EB] hover:text-black",

      replyToMessage: "bg-blue-100 border border-blue-300 text-blue-900",

      messageDoctor:
        "bg-gradient-to-r from-[#24487D] via-[#3065BA] to-[#24487D] text-[#e0e6f1] shadow-lg shadow-[#18335f]/70",

      messagePatient:
        "bg-gradient-to-r from-[#3065BA] via-[#4a7ed9] to-[#3065BA] text-[#e0e6f1] border border-[#3f7dde] shadow-lg shadow-[#234e8c]/70",

      input:
        "bg-gradient-to-br from-[#0b162a] via-[#132847] to-[#0b162a] text-[#e0e6f1] border-[#1a2e40] shadow-inner shadow-[#09192d]/80",

      iconBg: "text-white",

      sendButton:
        "bg-gradient-to-r from-[#688efb] via-[#7ca3ff] to-[#5a7de4] hover:from-[#5a7de4] hover:to-[#4d6fd1] text-white shadow-xl shadow-blue-400/50",
    },
    darkTeal00303d: {
      header:
        "bg-gradient-to-r from-[#00303d] via-[#004d5c] to-[#00232b] text-[#d4f0f4] shadow-lg shadow-cyan-900/80",

      mainBg:
        "bg-gradient-to-br from-[#E6F0F2] via-[#d4f0f4] to-[#cde7ea] shadow-inner shadow-cyan-100/30",

      sideBarBg:
        "bg-gradient-to-br from-[#E1E8E8] via-[#d8e6e6] to-[#E6F0F2] shadow-inner shadow-cyan-100/40",

      sidebarHeader:
        "bg-gradient-to-r from-[#00303d] via-[#00414f] to-[#00232b] text-[#d4f0f4] shadow-md shadow-cyan-800/80",

      sidebarActiveChat:
        "bg-gradient-to-r from-[#edf3f4] via-[#d4f0f4] to-[#edf3f4] shadow shadow-cyan-300/50 border border-[#bcdfe2]",

      sideBarHover:
        "hover:bg-gradient-to-r hover:from-[#deebed] hover:via-[#cde0e2] hover:to-[#deebed] hover:text-black",

      replyToMessage:
        "bg-gradient-to-r from-[#658992] via-[#79a7b2] to-[#658992] border border-blue-300 text-white shadow-md shadow-[#3b5961]/50",

      messageDoctor:
        "bg-gradient-to-r from-[#004d5c] via-[#036b7b] to-[#004d5c] text-white shadow-lg shadow-[#002f35]/70",

      messagePatient:
        "bg-gradient-to-r from-[#4D737D] via-[#5f8f99] to-[#4D737D] text-[#d4f0f4] border border-[#6e9da5] shadow-lg shadow-[#2e4d53]/70",

      editMessageInput: "text-black",

      input:
        "bg-gradient-to-br from-[#001f26] via-[#00303d] to-[#001f26] text-[#d4f0f4] border-[#00303d] shadow-inner shadow-[#001015]/80",

      iconBg: "text-white",

      sendButton:
        "bg-gradient-to-r from-[#00303d] via-[#036b7b] to-[#00414f] hover:from-[#36a69c] hover:to-[#2e8a83] text-white shadow-xl shadow-cyan-400/50",
    },
  };
  // reply to message
  const [replyToMessage, setReplyToMessage] = useState(null);

  return (
    <div className="flex flex-col overflow-hidden ">
      <div
        className={`flex flex-1 overflow-hidden border-red-800 ${themeClasses[selectedTheme].sideBarBg} `}
      >
        <Sidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          theme={themeClasses[selectedTheme]}
        />

        <main
          className={` flex-1 flex flex-col h-[91vh] md:max-h-screen overflow-hidden pb-safe ${themeClasses[selectedTheme].mainBg} `}
        >
          <div
            className={`flex-none sticky top-0 z-10 p-4 border-b shadow-sm flex items-center ${themeClasses[selectedTheme].header}`}
          >
            <FaUserCircle className="text-2xl mr-2 sm:text-3xl sm:mr-3" />
            <div className="flex-1">
              <div className="font-bold text-left sm:text-base">
                {selectedConversation.patientName}
              </div>
              <div className="text-sm text-left">Patient</div>
            </div>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="ml-4 p-1 rounded border text-sm bg-white text-black"
            >
              <option value="default">Default (Purple)</option>
              <option value="darkRoyalBlue">Dark Royal Blue</option>
              <option value="darkTeal00303d">Dark Teal 00303d</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 sm:p-4 sm:space-y-6">
            {selectedConversation.messages.map((msg) => {
              const isDoctor = msg.from === "doctor";
              const isEditing = editingMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isDoctor ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`group relative max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-2xl shadow-md transition-all duration-200 ${
                      isDoctor
                        ? themeClasses[selectedTheme].messageDoctor
                        : themeClasses[selectedTheme].messagePatient
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          value={editingMessageText}
                          onChange={(e) =>
                            setEditingMessageText(e.target.value)
                          }
                          className={`border rounded px-2 py-1 text-sm ${themeClasses[selectedTheme].editMessageInput}`}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600"
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {msg.replyTo && (
                          <div className="text-xs italic text-gray-100 border-l-2 border-gray-400 pl-2 mb-1">
                            Replying to: {msg.replyTo}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className="text-xs text-gray-100 mt-1 text-right">
                          {msg.time}
                        </div>

                        <div className="flex justify-start space-x-4 text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleCopyMessage(msg.text)}
                            title="Copy"
                            className={` ${themeClasses[selectedTheme].iconBg} `}
                          >
                            <FiCopy />
                          </button>

                          <button
                            onClick={() => setReplyToMessage(msg)}
                            title="Reply"
                            className={` ${themeClasses[selectedTheme].iconBg} `}
                          >
                            <BsReply />
                          </button>

                          {isDoctor ? (
                            <button
                              onClick={() => handleStartEditing(msg)}
                              title="Edit"
                              className={`${themeClasses[selectedTheme].iconBg} `}
                            >
                              <FiEdit2 />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReadAloud(msg.text)}
                              title="Read aloud"
                              className={`${themeClasses[selectedTheme].iconBg}`}
                            >
                              <FiVolume2 />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {replyToMessage && (
            <div
              className={`flex items-center justify-between p-2 mb-1 rounded ${themeClasses[selectedTheme].replyToMessage}`}
            >
              <span className="text-sm">
                Replying to: <em>{replyToMessage.text}</em>
              </span>
              <button
                onClick={() => setReplyToMessage(null)}
                className="ml-2 text-red-500 font-bold"
                title="Cancel reply"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex-none p-3 sm:p-3 border-t bg-white flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message and press Enter..."
              className={`flex-1 rounded-full px-4 py-2 sm:px-4 sm:py-2 focus:outline-none ${themeClasses[selectedTheme].input}`}
            />
            <button
              onClick={handleSendMessage}
              className={`ml-2 ${themeClasses[selectedTheme].sendButton} hover:bg-[#8e69e4] text-white rounded-full p-2`}
            >
              <FiSend className="text-xl sm:text-xl" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
