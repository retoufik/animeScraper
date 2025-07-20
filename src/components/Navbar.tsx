import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar(): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "Favorites", path: "/favorites" },
    { name: "Contact Us", path: "/contact" },
    { name: "Categories", path: "/categories" },
  ];

  const genres = [
    ["Action", "Music", "Shonen"],
    ["Adventure", "Romance", "Slice of life"],
    ["Comedy", "Sci-Fi", "Sports"],
    ["Drama", "Seinen", "Supernatural"],
    ["Fantasy", "Shojo", "Thriller"],
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AnimeScraper
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) =>
              item.name === "Categories" ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <button
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group overflow-hidden flex items-center gap-1 ${
                      location.pathname === item.path
                        ? "text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 shadow-lg shadow-purple-500/25"
                        : "text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent hover:shadow-md hover:shadow-white/10"
                    }`}
                    aria-haspopup="true"
                    aria-expanded={isCategoriesOpen}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isCategoriesOpen && (
                    <div className="absolute left-0 mt-2 w-[600px] bg-[#232329] border border-white/10 rounded-lg shadow-2xl z-50 flex text-white animate-fadeIn" style={{minHeight: '220px'}}>
                      {/* Left column */}
                      <div className="w-1/3 border-r border-white/10 p-6 flex flex-col gap-4">
                        <Link to="/categories/all" className="hover:underline">Browse All (A-Z)</Link>
                        <Link to="/calendar" className="hover:underline">Release Calendar</Link>
                        <Link to="/music-videos" className="hover:underline">Music Videos & Concerts</Link>
                      </div>
                      {/* Right columns: Genres */}
                      <div className="flex-1 p-6 grid grid-cols-3 gap-x-8">
                        <div className="col-span-3 mb-2 text-xs text-gray-400 tracking-widest font-semibold">GENRES</div>
                        {genres.flat().map((genre, idx) => (
                          <div key={genre} className="mb-2 col-span-1">
                            <Link to={`/categories/${genre.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">{genre}</Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group overflow-hidden ${
                    location.pathname === item.path
                      ? "text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 shadow-lg shadow-purple-500/25"
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent hover:shadow-md hover:shadow-white/10"
                  }`}
                >
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 rounded-lg" />
                  {/* Animated underline for active state */}
                  {location.pathname === item.path && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
                  )}
                  {/* Hover underline */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-white/50 to-white/50 rounded-full transition-all duration-300" />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              )
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-3 bg-white/10 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 border border-white/20 hover:border-purple-400/50 rounded-xl text-white hover:text-purple-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-white/10 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 border border-white/20 hover:border-purple-400/50 rounded-xl text-white hover:text-purple-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : 'group-hover:rotate-12'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/60 backdrop-blur-md rounded-lg mt-2 border border-white/10">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 group relative overflow-hidden ${
                    location.pathname === item.path
                      ? "text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 shadow-lg shadow-purple-500/25"
                      : "text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:border-white/20 border border-transparent hover:shadow-md hover:shadow-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Background glow effect for mobile */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 rounded-lg" />
                  
                  {/* Active indicator */}
                  {location.pathname === item.path && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full animate-pulse" />
                  )}
                  
                  <span className="relative z-10 ml-2">{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile User Action */}
              <div className="flex items-center justify-center px-3 py-4 border-t border-white/10 mt-2">
                <button className="p-3 bg-white/10 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 border border-white/20 hover:border-purple-400/50 rounded-xl text-white hover:text-purple-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}