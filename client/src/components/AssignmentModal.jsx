import { useState, useEffect } from "react";
import axios from "axios";

const AssignmentModal = ({ fileId, onClose, backendUrl }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileId) {
      setError("No file specified");
      setIsLoading(false);
      return;
    }

    const fetchPdf = async () => {
      try {
        // Verify file exists first
        const verifyRes = await axios.get(
          `${backendUrl}/api/assignments/file/${fileId}/exists`
        );

        if (!verifyRes.data.exists) {
          throw new Error("File not found");
        }

        // Fetch the PDF
        const response = await axios.get(
          `${backendUrl}/api/assignments/file/${fileId}`,
          { responseType: "blob" }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) {
        setError(err.message || "Failed to load PDF");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [fileId, backendUrl]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl relative">
          <div className="flex justify-center items-center h-64">
            <p>Loading PDF...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          >
            &times;
          </button>
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">{error}</p>
            <a
              href={`${backendUrl}/api/assignments/file/${fileId}`}
              download
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Download PDF Instead
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl relative h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold z-10"
        >
          &times;
        </button>
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0`}
          width="100%"
          height="100%"
          className="border-none"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default AssignmentModal;
