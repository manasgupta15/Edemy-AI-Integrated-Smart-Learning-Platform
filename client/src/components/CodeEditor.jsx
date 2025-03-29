// import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import Editor from "@monaco-editor/react";

// const CodeEditor = ({ roomId, username }) => {
//   const [code, setCode] = useState("");
//   const [language, setLanguage] = useState("javascript");
//   const [users, setUsers] = useState([]);
//   const socketRef = useRef(null);

//   // With this:
//   const SOCKET_SERVER_URL =
//     import.meta.env.VITE_WS_URL ||
//     "wss://edemy-ai-integrated-smart-learning.onrender.com";
//   const socket = io(SOCKET_SERVER_URL, {
//     transports: ["websocket"], // Force WebSocket only
//     reconnection: true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000,
//   });

//   const supportedLanguages = [
//     "javascript",
//     "typescript",
//     "python",
//     "java",
//     "c",
//     "cpp",
//     "csharp",
//     "php",
//     "ruby",
//     "go",
//     "swift",
//     "rust",
//     "kotlin",
//     "dart",
//     "r",
//     "perl",
//     "scala",
//     "lua",
//   ];

//   useEffect(() => {
//     // Initialize socket connection
//     socketRef.current = io(SOCKET_SERVER_URL, {
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000,
//       transports: ["websocket"],
//       withCredentials: true,
//     });

//     // Join room with username
//     socketRef.current.emit("join-room", roomId, username);

//     // Setup event listeners
//     socketRef.current.on("receive-code", (newCode) => {
//       if (newCode !== code) setCode(newCode);
//     });

//     socketRef.current.on("receive-language", (newLanguage) => {
//       setLanguage(newLanguage);
//     });

//     socketRef.current.on("user-joined", (newUser) => {
//       setUsers((prev) => [...prev, newUser]);
//     });

//     socketRef.current.on("user-left", (leftUser) => {
//       setUsers((prev) => prev.filter((user) => user !== leftUser));
//     });

//     return () => {
//       // Cleanup on unmount
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//     };
//   }, [roomId, username]);

//   const handleCodeChange = (newValue) => {
//     setCode(newValue);
//     socketRef.current.emit("code-change", { roomId, code: newValue });
//   };

//   const handleLanguageChange = (e) => {
//     const newLanguage = e.target.value;
//     setLanguage(newLanguage);
//     socketRef.current.emit("language-change", {
//       roomId,
//       language: newLanguage,
//     });
//   };

//   return (
//     <div className="w-full">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-3xl font-extrabold text-blue-600">
//           Room: {roomId}
//         </h2>
//         <div className="text-gray-200">
//           Online: {users.length + 1} (You: {username})
//         </div>
//       </div>

//       <select
//         onChange={handleLanguageChange}
//         value={language}
//         className="text-lg font-semibold text-black bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 mx-auto block focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:bg-gray-200 hover:text-blue-600 mt-2"
//       >
//         {supportedLanguages.map((lang) => (
//           <option key={lang} value={lang}>
//             {lang}
//           </option>
//         ))}
//       </select>

//       <div className="flex justify-center items-center p-4">
//         <Editor
//           height="70vh"
//           width="80vw"
//           language={language}
//           value={code}
//           onChange={handleCodeChange}
//           options={{
//             fontSize: 16,
//             fontFamily: "Fira Code, monospace",
//             theme: "vs-dark",
//             minimap: { enabled: false },
//             autoClosingBrackets: "always",
//             autoIndent: "full",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ roomId, username }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);

  // Use this WebSocket URL (make sure it matches your Render deployment)
  const SOCKET_SERVER_URL =
    import.meta.env.VITE_WS_URL ||
    "wss://edemy-ai-integrated-smart-learning.onrender.com";

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
    // Initialize socket connection
    socketRef.current = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      withCredentials: true,
    });

    // Debug connection events
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    // Join room with username
    socketRef.current.emit("join-room", roomId, username);

    // Setup event listeners
    socketRef.current.on("receive-code", (newCode) => {
      if (newCode !== code) setCode(newCode);
    });

    socketRef.current.on("receive-language", (newLanguage) => {
      setLanguage(newLanguage);
    });

    socketRef.current.on("user-joined", (newUser) => {
      setUsers((prev) => [...prev, newUser]);
    });

    socketRef.current.on("user-left", (leftUser) => {
      setUsers((prev) => prev.filter((user) => user !== leftUser));
    });

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, username]);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socketRef.current.emit("code-change", { roomId, code: newValue });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socketRef.current.emit("language-change", {
      roomId,
      language: newLanguage,
    });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-extrabold text-blue-600">
          Room: {roomId}
        </h2>
        <div className="text-gray-200">
          Online: {users.length + 1} (You: {username})
        </div>
      </div>

      <select
        onChange={handleLanguageChange}
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
          height="70vh"
          width="80vw"
          language={language}
          value={code}
          onChange={handleCodeChange}
          options={{
            fontSize: 16,
            fontFamily: "Fira Code, monospace",
            theme: "vs-dark",
            minimap: { enabled: false },
            autoClosingBrackets: "always",
            autoIndent: "full",
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
