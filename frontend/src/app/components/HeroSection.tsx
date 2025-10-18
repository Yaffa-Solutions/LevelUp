// 'use client'
import Link from 'next/link'
// import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-12 py-10 md:py-16 max-w-7xl mx-auto">
      
      <div className="md:w-1/2 mt-10 md:mt-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-snug">
          <span className="text-purple-600 block">Level Up Your Skills.</span>
          Level Up Your Team.
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg">
          Whether you're a software engineer seeking growth or a talent hunter searching for expertise، <strong>LevelUp</strong> is your AI-powered platform for <strong>evaluation, connection, and opportunity.</strong>
        </p>
        <Link href="/get-started" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-xl text-lg transition duration-300 shadow-lg hover:shadow-xl">
          Get Started
        </Link>
      </div>

      <div className="md:w-1/2 relative flex justify-center">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg">
          {/* <Image
            src="/hero-image-placeholder.jpg"
            alt="AI Assessment in progress"
            width={600}
            height={400}
            className="object-cover w-full h-auto"
            priority
          /> */}
          <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            ● AI Assessment
          </div>
          <div className="absolute bottom-4 right-4 bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-300">
            4 Skill Levels
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
