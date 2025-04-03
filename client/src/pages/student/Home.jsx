import BlogSection from "../../components/student/BlogSection";
import CallToAction from "../../components/student/CallToAction";
import Companies from "../../components/student/Companies";
import CourseSection from "../../components/student/CourseSection";
import FAQs from "../../components/student/FAQs";
import Footer from "../../components/student/Footer";
import Hero from "../../components/student/Hero";
import HowItWorks from "../../components/student/HowItWorks";
import KeyFeatures from "../../components/student/KeyFeatures ";
import TestimonialsSection from "../../components/student/TestimonialsSection";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <Companies />
      <CourseSection />
      <TestimonialsSection />
      <BlogSection /> {/* ✅ Add Blog Section Here */}
      <HowItWorks />
      <KeyFeatures />
      <FAQs />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
