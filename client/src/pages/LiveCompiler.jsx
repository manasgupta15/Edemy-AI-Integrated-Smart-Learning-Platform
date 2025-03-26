import { useState, useEffect, useContext } from "react";
import AceEditor from "react-ace";
import axios from "axios";

// Import Ace Editor language modes
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";

// Import themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-xcode";
import { AppContext } from "../context/AppContext";

// Pre-written code snippets for each language
const codeSnippets = {
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

// Language options
const languages = [
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
];

const LiveCompiler = () => {
  const { backendUrl } = useContext(AppContext);
  const [code, setCode] = useState(codeSnippets.python); // Default to Python
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState("monokai"); // Default to dark theme
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Update code snippet when language changes
  useEffect(() => {
    setCode(codeSnippets[language]);
  }, [language]);

  // Handle Code Execution
  const runCode = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/execute`, {
        language,
        code,
      });
      setOutput(
        response.data.success ? response.data.output : response.data.error
      );
    } catch (error) {
      setOutput("Error executing code.");
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
          useWorker: false, // Fixes the '|' typing issue
        }}
      />

      {/* Run Button */}
      <button
        className={`mt-4 p-2 ${
          isDarkMode ? "bg-blue-600" : "bg-blue-500"
        } text-white rounded hover:bg-blue-700 transition duration-300`}
        onClick={runCode}
      >
        Run Code
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
