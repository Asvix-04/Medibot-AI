import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

const VoiceChat = ({ setInputText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      if (setInputText) setInputText(text);
    };

    recognition.onerror = (e) => {
      console.error("Recognition error:", e.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [setInputText]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <button
      type="button"
      onClick={isRecording ? stopListening : startListening}
      className={`p-4 mb-1 mr-2 rounded-lg ml-2 transition-all ${isRecording
          ? "bg-red-500 text-white animate-pulse"
          : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-[#d6d4d4] hover:shadow-md cursor-pointer"
        }`}
    >
      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
};

export default VoiceChat;
