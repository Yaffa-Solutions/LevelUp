
import Link from 'next/link';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeatureCard from './components/FeatureCard';
import RoleCard from './components/RoleCard';
import { FeatureData, RoleData } from '../types';


const features: FeatureData[] = [
  {
    title: 'Evaluation',
    description: 'AI-powered assessments that accurately measure technical and soft engineering level.',
    iconKey: 'evaluation',
    color: '#9d4ed9', 
  },
  {
    title: 'AI Roadmap',
    description: 'Personalized learning paths generated to help you reach the next level in your career.',
    iconKey: 'roadmap',
    color: '#e76f51', 
  },
  {
    title: 'Job Matching',
    description: 'Connect with opportunities that perfectly align with your skill set and career goals.',
    iconKey: 'matching',
    color: '#2a9d8f', 
  },
  {
    title: 'Community',
    description: 'Join a thriving community of engineers for support, collaboration, and growing together.',
    iconKey: 'community',
    color: '#f4a261', 
  },
];

const roles: RoleData[] = [
  {
    title: 'Talent developer',
    subtitle: 'Level up your skills.',
    description: 'Get AI-powered assessments, personalized growth roadmaps, and connect with opportunities that match your level.',
    iconKey: 'developer',
    iconColor: '#9d4ed9',
  },
  {
    title: 'Talent Hunters',
    subtitle: 'Find the right talent',
    description: "Whether you're a company or freelancer, discover engineers at exactly the skill level you need.",
    iconKey: 'hunter',
    iconColor: '#2a9d8f',
  },
];

const LandingPage: React.FC = () => {
  return (

    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        <HeroSection />

        <section className="text-center py-16 px-4 md:px-12 bg-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-800">
            Everything You Need to <span className="text-purple-600">Level Up</span>
          </h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
            Whether you&apos;re a software engineer looking to grow or a talent hunter seeking the right candidates, we have the tools to connect skills with opportunities.
          </p>

          <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="w-full sm:w-[48%] lg:w-[23%] min-w-[200px]">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-8 font-semibold">
            Platform Features
          </p>
        </section>

        <section className="text-center py-16 px-4 md:px-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-800">
            Built for <span className="text-purple-600">Talent developer</span> & <span className="text-teal-600">Talent Hunter</span>
          </h2>
          <p className="text-gray-600 mb-12 max-w-4xl mx-auto">
            Software engineers fall into different categories. You might be too busy with work, study, or life to focus on growth, or maybe you are not in the right environment to achieve your forward. We built a platform that brings everyone together.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <div key={index} className="w-full md:w-1/2">
                <RoleCard {...role} />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-8">
            <span className="text-purple-600 text-sm font-semibold border-b border-purple-600 pb-1 cursor-default">
              You can be both a talent and a hunter on our platform
            </span>
          </div>
        </section>

        <section className="text-center py-16 px-4 md:px-12 bg-white">
          <p className="text-sm font-semibold text-purple-600 mb-3 flex items-center justify-center">
            Ready to Level Up?
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-800">
            Start Your Journey <span className="text-purple-600 block">Today</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of software engineers who are already growing their skills, connecting with opportunities, and building the future of technology.
          </p>
          <Link href="/get-started">
            <span className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-12 rounded-xl text-xl transition duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center w-fit mx-auto cursor-pointer">
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </section>
      </main>

    </div>
  );
};

export default LandingPage;