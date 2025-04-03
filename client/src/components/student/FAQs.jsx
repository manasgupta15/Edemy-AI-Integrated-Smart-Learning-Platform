import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    id: "courses",
    question: "How do I enroll in a course?",
    answer:
      "Simply browse the available courses, select the one you're interested in, and click on 'Enroll'. If the course requires payment, complete the checkout process to access the content.",
  },
  {
    id: "assignments",
    question: "Can I submit assignments online?",
    answer:
      "Yes! Edemy allows students to submit assignments through the platform. Educators can review and grade them directly within the system.",
  },
  {
    id: "certificates",
    question: "Do I get a certificate after completing a course?",
    answer:
      "Yes, after successfully completing all course requirements, you will receive a digital certificate that can be downloaded and shared.",
  },
  {
    id: "support",
    question: "What support options are available?",
    answer:
      "We provide a dedicated support team to assist you. You can reach us via email or live chat for any course-related queries.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-4 md:py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Edemy. Can't find an answer?
            Contact our team.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <button
                aria-expanded={openIndex === index}
                aria-controls={`faq-${faq.id}`}
                className="w-full flex justify-between items-center px-6 py-5 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg md:text-xl font-semibold text-blue-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-700 text-base md:text-lg leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">Still have questions?</p>
          <Link
            to="/contact-us"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQs;
