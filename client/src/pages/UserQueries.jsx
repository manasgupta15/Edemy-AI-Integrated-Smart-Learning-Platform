import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const UserQueries = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/queries/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setQueries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching queries:", error);
        setQueries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [backendUrl, getToken]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-3xl p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          My Queries
        </h2>

        {loading ? (
          <p className="text-white text-center animate-pulse">Loading...</p>
        ) : queries.length === 0 ? (
          <p className="text-white text-center">No queries found.</p>
        ) : (
          <ul className="space-y-6">
            {queries.map((query) => (
              <li
                key={query._id}
                className="p-5 rounded-xl bg-white/20 text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border hover:border-white/30"
              >
                <p className="text-lg">
                  <strong className="text-blue-400">📌 Reason:</strong>{" "}
                  {query.reason}
                </p>
                <p>
                  <strong className="text-blue-400">💬 Message:</strong>{" "}
                  {query.message}
                </p>
                <p>
                  <strong className="text-yellow-400">🕒 Status:</strong>{" "}
                  <span className="uppercase font-semibold">
                    {query.status}
                  </span>
                </p>
                {query.response && (
                  <p className="text-lg">
                    <strong className="text-green-400">✅ Response:</strong>{" "}
                    {query.response}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserQueries;
