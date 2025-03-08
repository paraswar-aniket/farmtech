import React, { createContext, useEffect, useState } from "react";
import run from "../gemini";

export const datacontext = createContext();

function UserContext({ children }) {
    let SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    const [recognition, setRecognition] = useState(null);
    const [transcript, setTranscript] = useState("Click 'Start Listening' to begin");
    const [response, setResponse] = useState("");

    function speak(text) {
        let text_speak = new SpeechSynthesisUtterance(text);
        text_speak.volume = 1;
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.lang = "en-GB";
        window.speechSynthesis.speak(text_speak);
    }

    async function aiResponse(prompt) {
        let text = await run(prompt);
        text = text.replace(/\*/g, ""); // Remove asterisks from response
        let condensedText = text.split(". ").slice(0, 4).join(". ") + "."; // Limit to 4-5 lines
        setResponse(condensedText); // Display response in textbox
        speak(condensedText); // Saya speaks the response
        console.log("AI Response:", condensedText);
    }

    useEffect(() => {
        if (SpeechRecognition) {
            let recog = new SpeechRecognition();
            recog.continuous = false; 
            recog.interimResults = false;
            recog.lang = "en-US";
            recog.maxAlternatives = 3;

            recog.onstart = () => {
                console.log("Listening...");
                setTranscript("Listening...");
            };

            recog.onresult = async (event) => {
                if (event.results.length > 0) {
                    let bestResult = event.results[0][0];
                    let spokenText = bestResult.transcript.trim();

                    if (spokenText) {
                        setTranscript(spokenText);
                        console.log(`Recognized: "${spokenText}"`);
                        await aiResponse(spokenText);
                    } else {
                        setTranscript("Couldn't understand, please try again.");
                    }
                }
            };

            recog.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setTranscript("Error: Try again.");
            };

            recog.onend = () => {
                console.log("Speech recognition ended.");
            };

            setRecognition(recog);
        } else {
            setTranscript("Speech Recognition is not supported.");
        }
    }, []);

    let value = {
        recognition,
        transcript,
        response, // Make response available in context
    };

    return (
        <datacontext.Provider value={value}>{children}</datacontext.Provider>
    );
}

export default UserContext;