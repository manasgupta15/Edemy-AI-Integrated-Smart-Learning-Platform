import express from "express";
import { getAllCourse, getCourseId } from "../controllers/CourseController.js";

const courseRouter = express.Router();

courseRouter.get("/all", getAllCourse);
courseRouter.get("/:id", getCourseId);

export default courseRouter;
