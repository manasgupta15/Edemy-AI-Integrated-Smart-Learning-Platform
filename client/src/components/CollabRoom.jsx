// import { useState, useEffect } from "react";
// import CodeEditor from "./CodeEditor";
// import toast, { Toaster } from "react-hot-toast";

// const CollabRoom = () => {
//   const [roomId, setRoomId] = useState("");
//   const [username, setUsername] = useState("");
//   const [joined, setJoined] = useState(false);

//   // Function to generate a random Room ID
//   const generateRoomID = () => Math.random().toString(36).substr(2, 8);

//   // Load room ID from localStorage (if available)
//   useEffect(() => {
//     const savedRoomId = localStorage.getItem("roomId");
//     if (savedRoomId) setRoomId(savedRoomId);
//   }, []);

//   // Save Room ID to localStorage
//   useEffect(() => {
//     if (roomId) localStorage.setItem("roomId", roomId);
//   }, [roomId]);

//   const handleGenerateRoom = () => {
//     const newRoomId = generateRoomID();
//     setRoomId(newRoomId);
//     localStorage.setItem("roomId", newRoomId);
//   };

//   const handleCopyRoomId = () => {
//     if (!roomId) {
//       toast.error("No Room ID to copy!");
//       return;
//     }
//     navigator.clipboard.writeText(roomId);
//     toast.success("Room ID copied!");
//   };

//   const handleJoin = () => {
//     if (!username.trim()) {
//       toast.error("Enter a valid username!");
//       return;
//     }

//     if (!roomId.trim()) {
//       toast.error("Enter or generate a Room ID first!");
//       return;
//     }

//     toast.success(`Joined Room: ${roomId}`);
//     setJoined(true);
//   };

//   // Function to end the session
//   const handleLeaveRoom = () => {
//     setJoined(false);
//     setRoomId("");
//     setUsername("");
//     localStorage.removeItem("roomId");
//     toast.success("You left the room.");
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white">
//       <Toaster position="top-right" />
//       {!joined ? (
//         <div className="w-[400px] p-6 bg-[#1E293B] shadow-lg rounded-lg border border-gray-600">
//           <h2 className="text-2xl font-bold text-center text-[#38BDF8] mb-4">
//             Join a Collaboration Room
//           </h2>

//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Room ID"
//               value={roomId}
//               onChange={(e) => setRoomId(e.target.value)}
//               className="w-full p-3 bg-[#334155] text-white rounded-md border border-gray-500 outline-none focus:border-[#38BDF8]"
//             />
//             <button
//               onClick={handleGenerateRoom}
//               className="absolute right-2 top-2 text-sm px-3 py-1 bg-[#38BDF8] hover:bg-[#0284C7] text-white font-bold rounded-md transition-all"
//             >
//               Generate
//             </button>
//           </div>

//           <button
//             onClick={handleCopyRoomId}
//             className="mt-2 w-full px-3 py-2 bg-[#475569] hover:bg-[#64748B] text-white rounded-md transition-all"
//           >
//             Copy Room ID
//           </button>

//           <input
//             type="text"
//             placeholder="Enter Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full p-3 mt-3 bg-[#334155] text-white rounded-md border border-gray-500 outline-none focus:border-[#38BDF8]"
//           />

//           <button
//             onClick={handleJoin}
//             className="w-full mt-4 px-4 py-2 bg-[#38BDF8] hover:bg-[#0284C7] text-white font-bold rounded-md transition-all"
//           >
//             Join Room
//           </button>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center">
//           <CodeEditor roomId={roomId} username={username} />
//           <button
//             onClick={handleLeaveRoom}
//             className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md transition-all"
//           >
//             Leave Room
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollabRoom;

import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import toast, { Toaster } from "react-hot-toast";

const CollabRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const generateRoomID = () => Math.random().toString(36).substr(2, 8);

  useEffect(() => {
    const savedRoomId = localStorage.getItem("roomId");
    const savedUsername = localStorage.getItem("collabUsername");
    if (savedRoomId) setRoomId(savedRoomId);
    if (savedUsername) setUsername(savedUsername);
  }, []);

  useEffect(() => {
    if (roomId) localStorage.setItem("roomId", roomId);
    if (username) localStorage.setItem("collabUsername", username);
  }, [roomId, username]);

  const handleGenerateRoom = () => {
    const newRoomId = generateRoomID();
    setRoomId(newRoomId);
    toast.success("New room created!");
  };

  const handleCopyRoomId = () => {
    if (!roomId) {
      toast.error("No Room ID to copy!");
      return;
    }
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };

  const handleJoin = () => {
    if (!username.trim()) {
      toast.error("Please enter a username!");
      return;
    }
    if (!roomId.trim()) {
      toast.error("Please enter or generate a Room ID!");
      return;
    }
    setJoined(true);
    toast.success(`Joined room: ${roomId}`);
  };

  const handleLeaveRoom = () => {
    setJoined(false);
    toast.success("You left the room");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white p-4">
      <Toaster position="top-right" />
      {!joined ? (
        <div className="w-full max-w-md p-6 bg-[#1E293B] shadow-lg rounded-lg border border-gray-600">
          <h2 className="text-2xl font-bold text-center text-[#38BDF8] mb-6">
            {roomId ? "Join Room" : "Create New Room"}
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full p-3 bg-[#334155] text-white rounded-md border border-gray-500 outline-none focus:border-[#38BDF8]"
              />
              <button
                onClick={handleGenerateRoom}
                className="absolute right-2 top-2 text-sm px-3 py-1 bg-[#38BDF8] hover:bg-[#0284C7] text-white font-bold rounded-md transition-all"
              >
                New
              </button>
            </div>

            <button
              onClick={handleCopyRoomId}
              disabled={!roomId}
              className={`w-full px-3 py-2 text-white rounded-md transition-all ${
                roomId
                  ? "bg-[#475569] hover:bg-[#64748B]"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              Copy Room ID
            </button>

            <input
              type="text"
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-[#334155] text-white rounded-md border border-gray-500 outline-none focus:border-[#38BDF8]"
            />

            <button
              onClick={handleJoin}
              disabled={!roomId || !username}
              className={`w-full px-4 py-2 font-bold rounded-md transition-all ${
                roomId && username
                  ? "bg-[#38BDF8] hover:bg-[#0284C7] text-white"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl">
          <CodeEditor roomId={roomId} username={username} />
          <button
            onClick={handleLeaveRoom}
            className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md transition-all mx-auto block"
          >
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
};

export default CollabRoom;
