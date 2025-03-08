import React, { useContext, useState } from "react";
import "./ChatOverlay.css";
import va from "../../assets/aimg.webp"; // Adjust the path if needed
import { datacontext } from "../../context/UserContext";

const ChatOverlay = () => {
  const { recognition, transcript, response } = useContext(datacontext);
  const [isOpen, setIsOpen] = useState(false);

  // Stop speech function: cancels both speech synthesis and voice recognition
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    recognition.stop();
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <button 
        className="floating-assistant" 
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      {/* Chatbox Overlay */}
      <div className={`chatbox ${isOpen ? "open" : ""}`}>
        <div className="card">
          <h2>
            Hello, I'm <span className="highlight">Riya</span>, Your Farm Assistant!
          </h2>
          <img src={va} alt="Riya" className="saya-img" />

          {/* Listening Indicator */}
          <p className={`listening-text ${transcript === "Listening..." ? "active" : ""}`}>
            {transcript === "Listening..." ? "🎤 Listening..." : ""}
          </p>

          <textarea
            value={response}
            readOnly
            placeholder="Response"
            className="response-box"
          />

          <input
            type="text"
            placeholder="Write your Query Here!"
            className="input-box"
          />

          {/* Buttons for Start and Stop Listening */}
          <div className="button-group">
            <button 
              className="ask-button" 
              onClick={() => recognition.start()}
            >
              Start Listening
            </button>
            <button 
              className="stop-button" 
              onClick={stopSpeaking}
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatOverlay;
