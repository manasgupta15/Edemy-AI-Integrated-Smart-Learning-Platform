import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Enroll in a Course",
    description: "Browse and enroll in courses to start your learning journey.",
    delay: 0.2,
  },
  {
    title: "Access Learning Materials",
    description: "Watch video lectures, read notes, and download resources.",
    delay: 0.4,
  },
  {
    title: "Complete Quizzes & Assignments",
    description:
      "Test your knowledge with quizzes and submit assignments for evaluation.",
    delay: 0.6,
  },
  {
    title: "Interact & Ask Questions",
    description:
      "Engage with educators and peers through the discussion forum.",
    delay: 0.8,
  },
  {
    title: "Earn Certificates",
    description:
      "Complete courses successfully to receive verified certificates.",
    delay: 1.0,
  },
];

const HowItWorks = () => {
  return (
    <div className="w-full py-2 px-6 md:px-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-medium text-gray-800 text-center">
          How Edemy Works
        </h2>
        <p className="text-gray-600 mt-2">
          Follow these simple steps to enhance your learning experience.
        </p>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: step.delay, duration: 0.8 }}
            className="p-6 md:p-8 w-full md:w-1/3 text-center border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-blue-600 w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {step.title}
            </h3>
            <p className="text-gray-600 mt-2">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
