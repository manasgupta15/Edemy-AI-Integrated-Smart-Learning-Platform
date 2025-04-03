import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center text-center gap-6 pt-12 pb-24 px-8 md:px-0">
      <h1 className="text-2xl md:text-5xl font-bold text-gray-900 leading-tight">
        Unlock Knowledge Anytime, Anywhere
      </h1>
      <p className="text-gray-600 text-lg max-w-xl">
        Master new skills at your own pace with expert-led courses, interactive
        assignments, and certifications that elevate your career.
      </p>
      <div className="flex flex-col sm:flex-row items-center font-medium gap-6 mt-6">
        <button className="px-10 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg">
          Get Started
        </button>
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all duration-300">
          Learn More{" "}
          <img src={assets.arrow_icon} alt="arrow_icon" className="w-5" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
