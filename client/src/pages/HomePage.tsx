import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary-dark z-0"></div>
        <div 
          className="absolute inset-0 opacity-10 bg-repeat z-0" 
          style={{ backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAGAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAARoABQAAAAEAAABWARsABQAAAAEAAABeASgAAwAAAAEAAgAAh2kABAAAAAEAAABmAAAAAAAAAEgAAAABAAAASAAAAAEAAqACAAQAAAABAAAAFKADAAQAAAABAAAAFAAAAAC5Pc2XAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACZmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MjA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MjA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/OtIAAAAcaURPVAAAAAIAAAAAAAAACgAAACgAAAAKAAAACgAAACA6EQ3OAAAAGEJJREFUOE9jYBgFoyEwGgKjITAaAmQJAQAC9AAB2TgMKQAAAABJRU5ErkJggg==')" }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                  Build Better Habits with <span className="text-accent">HabitNest</span>
                </h1>
                <p className="text-xl text-gray-100 mb-8 max-w-lg mx-auto md:mx-0">
                  Track your goals, build consistent habits, and achieve more every day with your personal growth companion.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    to="/register"
                    className="inline-block px-8 py-3 bg-accent text-white font-semibold rounded-lg shadow-lg hover:bg-accent-dark transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Get Started — It's Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-block px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    Login
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <div className="w-full md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 bg-white dark:bg-dark-surface rounded-xl shadow-2xl overflow-hidden">
                  <img 
                    src="/img/dashboard-preview.png" 
                    alt="HabitNest Dashboard Preview" 
                    className="w-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/600x400/4f46e5/white?text=HabitNest+Dashboard';
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 backdrop-blur-md rounded-full z-0"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-light/20 backdrop-blur-md rounded-full z-0"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose HabitNest?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform is designed to help you build and maintain positive habits that lead to lasting change.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Habit Tracking",
                description: "Easily track daily habits with intuitive tools designed to keep you accountable and motivated.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Goal Setting",
                description: "Set SMART goals with clear milestones and deadlines to turn your dreams into achievable steps.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Progress Insights",
                description: "Visualize your progress with insightful analytics to understand what's working and what needs adjustment.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-dark-surface rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-primary dark:text-accent mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How HabitNest Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Follow these simple steps to transform your daily routine.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Sign Up",
                description: "Create your free account in seconds and start your journey.",
              },
              {
                number: "02",
                title: "Set Goals",
                description: "Define what success looks like for you with achievable goals.",
              },
              {
                number: "03",
                title: "Track Habits",
                description: "Monitor your daily actions that contribute to your goals.",
              },
              {
                number: "04",
                title: "Achieve More",
                description: "Watch your progress and celebrate your victories along the way.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full mb-6 mx-auto">
                  <span className="text-primary dark:text-accent text-xl font-bold">{step.number}</span>
                  {index < 3 && (
                    <div className="hidden lg:block absolute left-full w-16 h-0.5 bg-primary/20 dark:bg-primary/30" style={{ width: 'calc(100% - 4rem)' }}></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary dark:bg-dark-surface-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Better Habits?
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Join thousands of users who have transformed their lives with HabitNest.
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-accent text-white font-semibold rounded-lg shadow-lg hover:bg-accent-dark transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Your Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 