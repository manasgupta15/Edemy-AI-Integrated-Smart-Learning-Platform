const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-shadow duration-300">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center hover:text-purple-600 transition-colors duration-300">
            About Us
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Welcome to <span className="font-bold text-purple-600">Edemy</span>,
            your ultimate learning platform. Our mission is to provide
            high-quality, accessible education to everyone, anywhere.
          </p>

          {/* Our Vision Section */}
          <div className="group p-6 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300 cursor-pointer mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We aim to bridge the gap between students and educators by
              creating an engaging, interactive, and personalized learning
              experience. Our vision is to empower learners worldwide with the
              skills and knowledge they need to succeed in a rapidly evolving
              world.
            </p>
          </div>

          {/* Why Choose Us Section */}
          <div className="group p-6 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300 cursor-pointer mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
              Why Choose Us?
            </h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
              <li>
                <span className="font-semibold">Expert Educators:</span> Learn
                from industry professionals and certified instructors.
              </li>
              <li>
                <span className="font-semibold">Interactive Courses:</span>
                Hands-on projects, quizzes, and real-world applications.
              </li>
              <li>
                <span className="font-semibold">Flexible Learning:</span> Study
                at your own pace, anytime, anywhere.
              </li>
              <li>
                <span className="font-semibold">Certifications:</span> Earn
                recognized certifications to boost your career.
              </li>
              <li>
                <span className="font-semibold">Community Support:</span> Join a
                global community of learners and mentors.
              </li>
            </ul>
          </div>

          {/* Our Team Section */}
          <div className="group p-6 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300 cursor-pointer mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
              Our Team
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our team is composed of passionate educators, developers, and
              designers who are dedicated to creating the best learning
              experience for you. Meet some of our key members:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900">
                  John Doe
                </h3>
                <p className="text-gray-700">Co-Founder & CEO</p>
              </div>
              <div className="p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900">
                  Jane Smith
                </h3>
                <p className="text-gray-700">Head of Education</p>
              </div>
            </div>
          </div>

          {/* Our Achievements Section */}
          <div className="group p-6 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300 cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
              Our Achievements
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Over the years, we have achieved significant milestones that
              reflect our commitment to excellence:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
              <li>1,000,000+ learners worldwide</li>
              <li>500+ certified courses</li>
              <li>95% learner satisfaction rate</li>
              <li>Recognized by Forbes as a top EdTech platform</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
