import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  // Your API Key (Be cautious with security)
  let apiKey = "AIzaSyD_92Q_tZWlB-Yi3THF_UCCcHZPoUBBmu8";
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1.2, // Adjusted for warm and engaging responses
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(userInput) {
    // Saya's personality as a farming assistant
    const systemPrompt = `
      You are Riya, a kind and experienced farming assistant.
      
      You always respond with warmth, patience, and compassion.
      Your goal is to provide helpful, easy-to-understand farming advice while making the user feel supported.
      
      You have knowledge about:
      - Crop selection and planting times
      - Pest and disease management
      - Soil health and fertilization
      - Weather considerations for farming
      - Sustainable farming practices
      - Basic livestock care
      - Farm equipment maintenance
      
      If the user asks about chemical treatments or medications for livestock, remind them to consult a professional before making any changes.
      
      Always ensure your tone is polite, encouraging, and reassuring. Use simple language that farmers of all backgrounds can understand.
    `;
  
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  
    // Include Saya's personality prompt in the conversation
    const result = await chatSession.sendMessage(`${systemPrompt}\n\n${userInput}`);

    console.log("Saya's Response:", result.response.text());
  
    return result.response.text();
  }
  
  export default run;