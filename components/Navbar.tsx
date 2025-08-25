"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Menu, X, User, Mail, Award, Calendar } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  const { status, data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setShowSignOutModal(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrollY > 50
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200 transform"
          : "bg-white transform"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-black group-hover:text-orange-500 transition-colors duration-300">
              <Link href="/">ClubSync</Link>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {["Home", "About", "Contact", "Clubs", "Events"].map((item, index) => {
              const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  href={href}
                  className="text-gray-700 hover:text-orange-500 transition-all duration-300 font-medium relative group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
                </Link>
              );
            })}
            {status === "unauthenticated" && (
              <Link href="/login">
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg">
                  Sign In
                </button>
              </Link>
            )}
            {status === "authenticated" && (
              <div 
                className="relative flex items-center space-x-3 cursor-pointer"
                onMouseEnter={() => setShowProfileTooltip(true)}
                onMouseLeave={() => setShowProfileTooltip(false)}
              >
                {session.user?.image?.includes("dicebear.com") ? (
                  <img
                    src={session.user.image}
                    alt={session.user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-orange-300 transition-colors duration-300"
                  />
                ) : (
                  <Image
                    src={session.user?.image || "/default-avatar.png"}
                    alt={session.user?.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover border-2 border-gray-200 hover:border-orange-300 transition-colors duration-300"
                  />
                )}
                <span className="text-gray-700 font-medium hover:text-orange-500 transition-colors duration-300">
                  {session.user?.name || "User"}
                </span>
                
                {/* Profile Tooltip */}
                {showProfileTooltip && (
                  <div className="absolute top-full -right-60 mt-1 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 transform opacity-0 animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {session.user?.image?.includes("dicebear.com") ? (
                          <img
                            src={session.user.image}
                            alt={session.user?.name || "User"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-orange-300"
                          />
                        ) : (
                          <Image
                            src={session.user?.image || "/default-avatar.png"}
                            alt={session.user?.name || "User"}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border-2 border-orange-300"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {session.user?.name || "User"}
                            </h3>
                            <p className="text-sm text-gray-600">Senior Volunteer</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                              <Award className="w-4 h-4" />
                              <span>320 Points</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-orange-500" />
                            <span className="truncate max-w-48">{session.user?.email || "No email"}</span>
                          </div>
                          <Link 
                            href="/volunteer/profile"
                            className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors duration-300"
                          >
                            <User className="w-4 h-4" />
                            <span>View Profile</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/*logout*/}
          {status === "authenticated" && (
            <button
              onClick={() => setShowSignOutModal(true)}
              className="hidden md:block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 font-medium"
            >
              Sign Out
            </button>
          )}

          {/* Sign Out Modal */}
          {/* Sign Out Modal */}
          {showSignOutModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/95 backdrop-blur-lg rounded-xl p-6 max-w-sm mx-4 shadow-2xl border border-white/20">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sign Out
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to sign out of your account?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSignOutModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300/50 rounded-lg text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex-1 px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600/90 backdrop-blur-sm transition-all duration-200 shadow-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transform transition-transform duration-200 hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pt-4 pb-4 border-t border-gray-200">
            {["Features", "Demo", "Community"].map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-orange-500 transition-all duration-300 font-medium transform hover:translate-x-2"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: mobileMenuOpen
                    ? "translateX(0)"
                    : "translateX(-20px)",
                }}
              >
                {item}
              </a>
            ))}
            <Link href="/register">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium w-fit transform hover:scale-105">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
