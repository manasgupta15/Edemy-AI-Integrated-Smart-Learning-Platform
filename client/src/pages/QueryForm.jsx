import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QueryForm = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await axios.post(
        `${backendUrl}/api/queries`,
        { reason, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Query submitted successfully!");
      setReason("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("Failed to submit query.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Submit a Query
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="text-white font-semibold">Reason:</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md border-none text-white focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900 text-white">
              Select a reason
            </option>
            <option value="Technical Issue" className="bg-gray-900 text-white">
              Technical Issue
            </option>
            <option value="Course Query" className="bg-gray-900 text-white">
              Course Query
            </option>
            <option value="Payment Issue" className="bg-gray-900 text-white">
              Payment Issue
            </option>
            <option value="Other" className="bg-gray-900 text-white">
              Other
            </option>
          </select>

          <label className="text-white font-semibold">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md border-none text-white focus:ring-2 focus:ring-blue-400 min-h-[100px]"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold transition-transform transform hover:scale-105 shadow-md"
          >
            Submit Query
          </button>
        </form>

        <button
          onClick={() => navigate("/my-queries")}
          className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold transition-transform transform hover:scale-105 shadow-md"
        >
          View My Queries
        </button>
      </div>
    </div>
  );
};

export default QueryForm;
