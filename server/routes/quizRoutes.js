import express from "express";
import mongoose from "mongoose";
import Quiz from "../models/quizModel.js";
import QuizResult from "../models/quizResultModel.js";

const router = express.Router();

// ✅ Test Route
router.get("/", (req, res) => {
  res.send("Quiz API is working!");
});

// ✅ Create a quiz (Educators only)
router.post("/create", async (req, res) => {
  try {
    let { courseId, educatorId, title, questions, duration } = req.body;

    // ✅ Validate courseId only (educatorId is now a string)
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid courseId format" });
    }

    courseId = new mongoose.Types.ObjectId(courseId);

    if (
      !educatorId ||
      !title ||
      !questions ||
      questions.length === 0 ||
      !duration
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const quiz = new Quiz({
      courseId,
      educatorId, // ✅ Now stored as a string, so no need for ObjectId conversion
      title,
      questions,
      duration,
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch quizzes by Course ID
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid courseId format" });
    }

    const quizzes = await Quiz.find({ courseId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch a single quiz by Quiz ID
router.get("/single/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid quizId format" });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Submit a quiz (Evaluate & Save)
router.post("/submit", async (req, res) => {
  try {
    const { userId, quizId, answers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid quizId format" });
    }

    if (!userId || !answers) {
      return res.status(400).json({ error: "Missing userId or answers" });
    }

    // ✅ Check if user has already submitted this quiz
    const existingResult = await QuizResult.findOne({ userId, quizId });
    if (existingResult) {
      return res
        .status(400)
        .json({ error: "You have already submitted this quiz." });
    }

    // ✅ Fetch quiz and correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    let evaluation = [];

    quiz.questions.forEach((q, index) => {
      const userAnswer = answers[index] || ""; // Handle undefined answers
      const isCorrect = userAnswer === q.correctAnswer;

      if (isCorrect) {
        score += 1;
      }

      evaluation.push({
        question: q.questionText,
        userAnswer: userAnswer || "No answer selected",
        correctAnswer: q.correctAnswer,
        isCorrect,
      });
    });

    // ✅ Save quiz result in database
    const quizResult = new QuizResult({
      userId,
      quizId,
      courseId: quiz.courseId,
      score,
      totalQuestions: quiz.questions.length,
    });

    await quizResult.save();

    res.status(201).json({
      message: "Quiz submitted successfully",
      score,
      totalQuestions: quiz.questions.length,
      evaluation, // ✅ Send detailed evaluation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch Quiz Results for a User
router.get("/result/:quizId/:userId", async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ error: "Invalid quizId format" });
    }

    const result = await QuizResult.findOne({ quizId, userId });
    if (!result) {
      return res
        .status(404)
        .json({ error: "No result found. You have not submitted this quiz." });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch all quizzes created by an educator
router.get("/educator/:educatorId", async (req, res) => {
  try {
    const { educatorId } = req.params;

    // ❌ REMOVE this check since educatorId is a string now
    // if (!mongoose.Types.ObjectId.isValid(educatorId)) {
    //   return res.status(400).json({ error: "Invalid educatorId format" });
    // }

    const quizzes = await Quiz.find({ educatorId }); // ✅ No need to convert ObjectId

    if (!quizzes.length) {
      return res
        .status(404)
        .json({ error: "No quizzes found for this educator." });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fetch all quiz results for an educator
router.get("/educator/:educatorId/results", async (req, res) => {
  try {
    const { educatorId } = req.params;

    // ✅ Find quizzes created by this educator
    const quizzes = await Quiz.find({ educatorId });

    if (!quizzes.length) {
      return res
        .status(404)
        .json({ error: "No quizzes found for this educator." });
    }

    const quizIds = quizzes.map((quiz) => quiz._id);

    // ✅ Fetch all results
    let results = await QuizResult.find({ quizId: { $in: quizIds } }).populate(
      "quizId",
      "title"
    );

    // ✅ Fetch user details from Clerk API
    const uniqueUserIds = [...new Set(results.map((result) => result.userId))];
    const clerkUsers = {};

    for (const userId of uniqueUserIds) {
      try {
        const { data } = await axios.get(
          `https://api.clerk.dev/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            },
          }
        );
        clerkUsers[userId] = {
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
      } catch (error) {
        clerkUsers[userId] = {
          name: "Unknown",
          imageUrl: "https://via.placeholder.com/50",
        };
      }
    }

    // ✅ Attach user details to results
    results = results.map((result) => ({
      ...result._doc,
      user: clerkUsers[result.userId] || {
        name: "Unknown",
        imageUrl: "https://via.placeholder.com/50",
      },
    }));

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
