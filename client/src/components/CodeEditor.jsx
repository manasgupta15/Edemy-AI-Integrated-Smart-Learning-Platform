import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { AppContext } from "../context/AppContext";

const CodeEditor = ({ roomId, username }) => {
  const { backendUrl } = useContext(AppContext);
  const socket = io(`${backendUrl}`); // Replace with your backend URL
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const supportedLanguages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c",
    "cpp",
    "csharp",
    "php",
    "ruby",
    "go",
    "swift",
    "rust",
    "kotlin",
    "dart",
    "r",
    "perl",
    "scala",
    "lua",
  ];

  useEffect(() => {
    if (roomId) {
      socket.emit("join-room", roomId);
    }

    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("receive-code");
    };
  }, [roomId]);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socket.emit("code-change", { roomId, code: newValue });
  };

  return (
    <div style={{ width: "100%" }}>
      <h2 className="text-3xl font-extrabold text-blue-600 bg-gradient-to-r from-gray-100 to-gray-300 text-center p-4 rounded-lg shadow-md transition duration-300 hover:bg-gray-600 hover:text-white">
        Room: {roomId}
      </h2>

      <select
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
        className="text-lg font-semibold text-black bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:bg-gray-200 hover:text-blue-600 mt-2"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <div className="flex justify-center items-center p-4">
        <Editor
          height="400px"
          width="1000px"
          language={language}
          value={code}
          onChange={handleCodeChange}
          className="border border-gray-300 rounded-lg shadow-lg bg-gray-900 text-white"
          options={{
            fontSize: 16,
            fontFamily: "Fira Code, monospace",
            theme: "vs-dark", // Dark theme for a modern look
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            autoClosingBrackets: "always",
            autoIndent: "full",
            minimap: { enabled: false }, // Disable minimap for cleaner UI
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
