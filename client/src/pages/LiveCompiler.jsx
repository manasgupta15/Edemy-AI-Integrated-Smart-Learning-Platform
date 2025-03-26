// import { useState, useEffect, useContext } from "react";
// import AceEditor from "react-ace";
// import axios from "axios";

// // Import Ace Editor language modes
// import "ace-builds/src-noconflict/mode-python";
// import "ace-builds/src-noconflict/mode-c_cpp";
// import "ace-builds/src-noconflict/mode-javascript";

// // Import themes
// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/theme-xcode";
// import { AppContext } from "../context/AppContext";

// // Pre-written code snippets for each language
// const codeSnippets = {
//   c: `#include <stdio.h>

// int main() {
//     printf("Hello, World!\\n");
//     return 0;
// }`,
//   cpp: `#include <iostream>

// int main() {
//     std::cout << "Hello, World!" << std::endl;
//     return 0;
// }`,
//   python: `print("Hello, World!")`,
//   javascript: `console.log("Hello, World!");`,
// };

// // Language options
// const languages = [
//   { value: "c", label: "C" },
//   { value: "cpp", label: "C++" },
//   { value: "python", label: "Python" },
//   { value: "javascript", label: "JavaScript" },
// ];

// const LiveCompiler = () => {
//   const { backendUrl } = useContext(AppContext);
//   const [code, setCode] = useState(codeSnippets.python); // Default to Python
//   const [language, setLanguage] = useState("python");
//   const [output, setOutput] = useState("");
//   const [fontSize, setFontSize] = useState(14);
//   const [theme, setTheme] = useState("monokai"); // Default to dark theme
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   // Update code snippet when language changes
//   useEffect(() => {
//     setCode(codeSnippets[language]);
//   }, [language]);

//   // Handle Code Execution
//   const runCode = async () => {
//     try {
//       const response = await axios.post(`${backendUrl}/api/execute`, {
//         language,
//         code,
//       });
//       setOutput(
//         response.data.success ? response.data.output : response.data.error
//       );
//     } catch (error) {
//       setOutput("Error executing code.");
//     }
//   };

//   // Toggle between night and day themes
//   const toggleTheme = () => {
//     if (isDarkMode) {
//       setTheme("github");
//     } else {
//       setTheme("monokai");
//     }
//     setIsDarkMode(!isDarkMode);
//   };

//   return (
//     <div
//       className={`p-4 ${
//         isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       } min-h-screen`}
//     >
//       <h2 className="text-2xl font-bold mb-4">Live Coding Compiler</h2>

//       {/* Language Selector */}
//       <div className="mb-4">
//         <select
//           className={`p-2 rounded ${
//             isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
//           }`}
//           value={language}
//           onChange={(e) => setLanguage(e.target.value)}
//         >
//           {languages.map((lang) => (
//             <option key={lang.value} value={lang.value}>
//               {lang.label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Font Size Controls */}
//       <div className="flex gap-2 mb-4">
//         <button
//           className={`p-2 ${
//             isDarkMode ? "bg-gray-700" : "bg-gray-200"
//           } rounded`}
//           onClick={() => setFontSize(fontSize + 1)}
//         >
//           A+
//         </button>
//         <button
//           className={`p-2 ${
//             isDarkMode ? "bg-gray-700" : "bg-gray-200"
//           } rounded`}
//           onClick={() => setFontSize(fontSize - 1)}
//         >
//           A-
//         </button>
//       </div>

//       {/* Theme Toggle */}
//       <button
//         className={`p-2 mb-4 ${
//           isDarkMode ? "bg-gray-700" : "bg-gray-200"
//         } rounded`}
//         onClick={toggleTheme}
//       >
//         {isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
//       </button>

//       {/* Ace Code Editor */}
//       <AceEditor
//         mode={
//           language === "javascript"
//             ? "javascript"
//             : language === "python"
//             ? "python"
//             : "c_cpp"
//         }
//         theme={theme}
//         fontSize={fontSize}
//         value={code}
//         onChange={(newCode) => setCode(newCode)}
//         width="100%"
//         height="500px"
//         setOptions={{
//           enableBasicAutocompletion: true,
//           enableLiveAutocompletion: true,
//           enableSnippets: true,
//           showLineNumbers: true,
//           tabSize: 2,
//           useWorker: false, // Fixes the '|' typing issue
//         }}
//       />

//       {/* Run Button */}
//       <button
//         className={`mt-4 p-2 ${
//           isDarkMode ? "bg-blue-600" : "bg-blue-500"
//         } text-white rounded hover:bg-blue-700 transition duration-300`}
//         onClick={runCode}
//       >
//         Run Code
//       </button>

//       {/* Output Section */}
//       <div
//         className={`mt-4 p-4 ${
//           isDarkMode ? "bg-gray-800" : "bg-gray-100"
//         } rounded`}
//       >
//         <h3 className="font-bold text-lg">Output:</h3>
//         <pre
//           className={`text-sm mt-2 ${
//             isDarkMode ? "text-green-400" : "text-green-800"
//           }`}
//         >
//           {output}
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default LiveCompiler;

import { useState, useEffect, useContext } from "react";
import AceEditor from "react-ace";
import axios from "axios";
import { AppContext } from "../context/AppContext";

// Import Ace Editor language modes and themes
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-xcode";

// Pre-written code snippets for each language
const codeSnippets = {
  // Fixed typo from codeSnippets
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
  python: `print("Hello, World!")`,
  javascript: `console.log("Hello, World!");`,
};

// Language options - simplified since we're using the same codes for Piston
const languages = [
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python 3" },
  { value: "javascript", label: "JavaScript" },
];

const LiveCompiler = () => {
  const { backendUrl } = useContext(AppContext);
  const [code, setCode] = useState(codeSnippets.python);
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState("monokai");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Update code snippet when language changes
  useEffect(() => {
    setCode(codeSnippets[language]);
  }, [language]);

  // Handle Code Execution
  // Update only the runCode function:
  const runCode = async () => {
    setIsLoading(true);
    setOutput("Running code...");
    console.log("Executing code:", {
      language,
      code: code.substring(0, 100) + (code.length > 100 ? "..." : ""),
    });

    try {
      const startTime = Date.now();
      const response = await axios.post(`${backendUrl}/api/execute`, {
        language,
        code,
      });
      const duration = Date.now() - startTime;

      console.log("Execution completed in", duration, "ms", {
        success: response.data.success,
        outputLength: response.data.output?.length,
        error: response.data.error,
      });

      if (response.data.success) {
        setOutput(response.data.output || "Code executed (no output)");
      } else {
        setOutput(response.data.error || "Execution failed (no error details)");
      }
    } catch (error) {
      console.error("Execution request failed:", {
        error: error.message,
        response: error.response?.data,
        code: error.code,
      });

      let errorMessage = "Connection failed";
      if (error.response) {
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = "No response from server";
      }

      setOutput(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between night and day themes
  const toggleTheme = () => {
    if (isDarkMode) {
      setTheme("github");
    } else {
      setTheme("monokai");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`p-4 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } min-h-screen`}
    >
      <h2 className="text-2xl font-bold mb-4">Live Coding Compiler</h2>

      {/* Language Selector */}
      <div className="mb-4">
        <select
          className={`p-2 rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
          }`}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size Controls */}
      <div className="flex gap-2 mb-4">
        <button
          className={`p-2 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          } rounded`}
          onClick={() => setFontSize(fontSize + 1)}
        >
          A+
        </button>
        <button
          className={`p-2 ${
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          } rounded`}
          onClick={() => setFontSize(fontSize - 1)}
        >
          A-
        </button>
      </div>

      {/* Theme Toggle */}
      <button
        className={`p-2 mb-4 ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        } rounded`}
        onClick={toggleTheme}
      >
        {isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
      </button>

      {/* Ace Code Editor */}
      <AceEditor
        mode={
          language === "javascript"
            ? "javascript"
            : language === "python"
            ? "python"
            : "c_cpp"
        }
        theme={theme}
        fontSize={fontSize}
        value={code}
        onChange={(newCode) => setCode(newCode)}
        width="100%"
        height="500px"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
        }}
      />

      {/* Run Button */}
      <button
        className={`mt-4 p-2 ${
          isDarkMode ? "bg-blue-600" : "bg-blue-500"
        } text-white rounded hover:bg-blue-700 transition duration-300 flex items-center gap-2`}
        onClick={runCode}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Running...
          </>
        ) : (
          "Run Code"
        )}
      </button>

      {/* Output Section */}
      <div
        className={`mt-4 p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        } rounded`}
      >
        <h3 className="font-bold text-lg">Output:</h3>
        <pre
          className={`text-sm mt-2 ${
            isDarkMode ? "text-green-400" : "text-green-800"
          }`}
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

export default LiveCompiler;
