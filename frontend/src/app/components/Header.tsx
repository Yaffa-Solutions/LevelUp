import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 md:px-12 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-[#9333EA] to-[#2563EB]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="white"
                >
                  <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-black">LevelUp</span>
            </div>
      <nav className="flex items-center space-x-4">
        <Link href="/signup">
          <span className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 cursor-pointer hidden sm:block">
            Get Started
          </span>
        </Link>
        <Link href="/signin">
          <span className="text-gray-700 hover:text-purple-600 font-medium py-2 px-4 transition duration-300 cursor-pointer">
            Sign In
          </span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;