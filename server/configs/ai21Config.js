import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const AI21_API_KEY = process.env.AI21_API_KEY;

export const getAI21Response = async (message) => {
  try {
    const response = await axios.post(
      "https://api.ai21.com/studio/v1/chat/completions",
      {
        model: "jamba-1.5-mini", // or "jamba-1.5-large"
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${AI21_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content; // ✅ Correct response structure
  } catch (error) {
    console.error("AI21 API Error:", error.response?.data || error.message);
    return "I'm having trouble responding right now. Please try again later.";
  }
};
