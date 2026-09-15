import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { submitContact } from '../utils/api';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `You are the personal AI assistant for DevXByte's Portfolio. 
You are helpful, professional, and friendly. 
Your goal is to answer questions about DevXByte's skills (MERN stack, React, Node.js, Frontend Development, UI/UX, GSAP, etc.), projects, and experience. 
If someone wants to contact DevXByte, tell them to use the contact form on the website or reach out via LinkedIn/Email.
Keep your responses concise, engaging, and well-formatted. Do not use markdown that cannot be easily read as plain text.
IMPORTANT: If the user provides their phone number, email address, or explicitly asks to hire you or start a project, you MUST append the exact string "[LEAD_DETECTED]" at the very end of your response.`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi there! I am DevXByte's AI assistant. Ask me anything about his work, skills, or projects!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let responseText = null;
    let lastError = null;

    // Filter out the initial greeting or any leading 'model' messages 
    // because Gemini requires history to start with a 'user' role.
    const history = messages
      .filter((msg, index) => !(index === 0 && msg.role === 'assistant'))
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION
        });
        
        const chat = model.startChat({
          history: history,
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        responseText = response.text();
        break; // Success, exit the fallback loop
      } catch (err) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
        // Continue to the next model if it's a 404 or 503 or others
      }
    }

    try {
      if (!responseText) {
        throw lastError || new Error("All models failed to respond.");
      }

      let cleanText = responseText;

      // Check if Gemini flagged this conversation as a lead
      if (responseText.includes('[LEAD_DETECTED]')) {
        cleanText = responseText.replace('[LEAD_DETECTED]', '').trim();
        
        // Auto-submit lead to the backend
        try {
          await submitContact({
            name: "Chatbot Lead",
            email: "chatbot-auto@portfolio.local",
            subject: "Important Chatbot Conversation Detected",
            message: `User's last message: "${userMessage}"\n\nBot's reply: "${cleanText}"`
          });
          console.log("Chatbot lead saved to admin panel.");
        } catch (err) {
          console.error("Failed to save chatbot lead:", err);
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: cleanText }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      let errorMessage = "Oops, something went wrong. Please try again later.";
      if (error.message?.includes('503') || error.message?.includes('high demand')) {
        errorMessage = "I'm currently experiencing high demand and taking a quick breather. Please try asking me again in a few moments!";
      } else if (error.message) {
        // Only show full error details if it's not a generic 503
        errorMessage = `Error: ${error.message}`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-title">DevXByte's Assistant</span>
            <span className="chatbot-status">
              <span className="status-dot"></span> Online
            </span>
          </div>
          <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-bubble-container ${msg.role}`}>
              <div className="chat-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-container assistant">
              <div className="chat-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button type="submit" disabled={!input.trim() || isTyping}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default Chatbot;
