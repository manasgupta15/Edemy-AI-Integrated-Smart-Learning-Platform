import axios from "axios";

const API_URL = "http://localhost:5000/certificates";

export const getCertificate = async (userId, courseId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/${courseId}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const generateCertificate = async (
  userId,
  userName,
  courseId,
  courseName,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/generate`,
      { userId, userName, courseId, courseName },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};
