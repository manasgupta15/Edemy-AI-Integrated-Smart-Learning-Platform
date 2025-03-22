import { useEffect, useState } from "react";

const PrivacyPolicy = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll event to show/hide the "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-shadow duration-300">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center hover:text-purple-600 transition-colors duration-300">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Welcome to Edemy. Your privacy is important to us. This Privacy
            Policy explains how we collect, use, and protect your information
            when you use our platform.
          </p>

          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((section) => (
              <section
                key={section}
                id={`section-${section}`}
                className="group p-6 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300 cursor-pointer"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {section === 1 && "1. Information We Collect"}
                  {section === 2 && "2. How We Use Your Information"}
                  {section === 3 && "3. Security"}
                  {section === 4 && "4. Changes to This Policy"}
                  {section === 5 && "5. Contact Us"}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {section === 1 &&
                    "We collect personal information such as your name, email, and payment details when you register or make a purchase. We also collect usage data to improve our services."}
                  {section === 2 &&
                    "We use your information to provide and improve our services, process transactions, and enhance user experience. We do not sell your data to third parties."}
                  {section === 3 &&
                    "We implement security measures to protect your personal information. However, no method of transmission over the internet is 100% secure."}
                  {section === 4 &&
                    "We may update this Privacy Policy from time to time. Any changes will be posted on this page."}
                  {section === 5 && (
                    <>
                      If you have any questions about this Privacy Policy,
                      please contact us at{" "}
                      <a
                        href="mailto:support@edemy.com"
                        className="text-purple-600 hover:text-purple-800 transition-colors duration-300"
                      >
                        support@edemy.com
                      </a>
                      .
                    </>
                  )}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-300"
          aria-label="Back to Top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PrivacyPolicy;
