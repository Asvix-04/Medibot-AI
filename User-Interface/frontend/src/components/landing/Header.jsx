import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import medibot_logo from "../../assets/medibot_logo.jpg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-white/10 ${
        isScrolled ? "bg-[#121212] shadow-lg" : "bg-[#121212]/80"
      }`}
      style={{ minHeight: 72, backdropFilter: "blur(8px)" }}
    >
      <div
        className="max-w-7xl mx-auto px-4 flex items-center justify-between h-18"
        style={{ height: 72 }}
      >
        <Link
          to="/"
          className="flex items-center"
          aria-label="Medibot homepage"
        >
          <img
            src={medibot_logo}
            alt="Medibot"
            className="h-10 w-10 rounded-full p-1 bg-white object-cover"
          />
          <span className="text-xl font-bold text-white">Medibot</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-10"
          role="navigation"
          aria-label="Main Navigation"
        >
          <Link
            to="/"
            className="text-[#d6d4d4] hover:text-white transition-colors font-bold"
          >
            Home
          </Link>
          <a
            href="#features"
            className="text-[#d6d4d4] hover:text-white transition-colors font-bold"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[#d6d4d4] hover:text-white transition-colors font-bold"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="text-[#d6d4d4] hover:text-white transition-colors font-bold"
          >
            About
          </a>
          <a
            href="#faq"
            className="text-[#d6d4d4] hover:text-white transition-colors font-bold"
          >
            FAQ
          </a>
        </nav>

        {/* Sign In/Sign Up Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/signin"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 py-2 h-10 px-6 bg-[#1a103d] text-white border border-[#a970ff] rounded-full text-base font-medium shadow-none hover:bg-[#1a103d] hover:border-[#a970ff] hover:text-white"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 py-2 h-10 px-6 bg-[#1a103d] text-white border border-[#a970ff] rounded-full text-base font-medium shadow-none hover:bg-[#1a103d] hover:border-[#a970ff] hover:text-white"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#d6d4d4]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-controls="mobile-navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        role="navigation"
        aria-label="Mobile navigation"
        className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} mt-4`}
      >
        <div className="flex flex-col space-y-4 py-2">
          <Link
            to="/"
            className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md"
          >
            Home
          </Link>
          <a
            href="#features"
            className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md"
          >
            About
          </a>
          <a
            href="#faq"
            className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md"
          >
            FAQ
          </a>
          <div className="flex flex-col space-y-2 pt-4 border-t border-[#2a2a2a]">
            <Link
              to="/signin"
              className="text-[#d6d4d4] hover:text-white px-4 py-2 rounded-md"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-[#f75600] text-[#d6d4d4] px-4 py-2 rounded-md hover:bg-[#E2711D]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
