import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const GenerateCertificate = () => {
  const { courseId } = useParams(); // Get the courseId from the URL
  const [certificateUrl, setCertificateUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the certificate data
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = await localStorage.getItem("__session"); // Clerk session token
        const response = await axios.get(
          `/api/user/generate-certificate/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setCertificateUrl(response.data.certificateUrl);
        } else {
          setError(response.data.message || "Failed to generate certificate");
        }
      } catch (error) {
        setError(
          error.message || "An error occurred while fetching the certificate"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Your Certificate is Ready!</h1>
      <p className="mb-4">
        Click the button below to view or download your certificate.
      </p>
      <a
        href={certificateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
      >
        View Certificate
      </a>
    </div>
  );
};

export default GenerateCertificate;
