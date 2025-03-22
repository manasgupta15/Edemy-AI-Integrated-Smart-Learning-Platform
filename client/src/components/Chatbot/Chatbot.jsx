import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat([...chat, userMessage]);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/chatbot/chat",
        { message }
      );
      const botMessage = { sender: "bot", text: data.reply };
      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Chatbot Error:", error);
    }

    setMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border-2 border-gray-800 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Chatbot
          </h2>
          <div className="h-96 overflow-y-auto p-4 mb-4 bg-gray-100 rounded-lg border border-gray-200">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } mb-3`}
              >
                <span
                  className={`px-4 py-2 rounded-lg max-w-[75%] text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-l-lg bg-white focus:outline-none focus:border-blue-500 transition-colors duration-300 placeholder-gray-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button
              className="bg-blue-500 text-white px-6 rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
