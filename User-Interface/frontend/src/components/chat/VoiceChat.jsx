import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

const VoiceChat = ({ onDictate }) => {
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
      if (onDictate) onDictate(text);
    };

    recognition.onerror = (e) => {
      console.error("Recognition error:", e.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [onDictate]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported or not initialized.");
      return;
    }

    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recognition:", error.message);
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
        ? " text-[#6f6e6e] animate-pulse"
        : "text-[#454343] dark:text-white hover:shadow-md cursor-pointer "
        }`}
    >
      {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  );
};

export default VoiceChat;
