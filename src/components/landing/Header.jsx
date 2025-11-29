// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FileText, Menu, X } from "lucide-react";
// import ProfileDropdown from "../layout/ProfileDropdown";
// import Button from "../ui/Button";

// const Header = () => {
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isMenuOpen, setMenuOpen] = useState(false);
//     const isAuthenticated = false;
//     const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

//     const user = {
//         name: 'John Doe', email: 'john@example.com'
//     }
//     const logout = () => {

//     }
//     const navigate = useNavigate();
//     useEffect(() => {
//         const handelScroll = () => {
//             setIsScrolled(window.scrollY > 10);
//         };
//         window.addEventListener('scroll', handelScroll);
//         return () => window.removeEventListener('scroll', handelScroll);

//     }, []);
//     return (
//         <>
//             <header className={`fixed top-0 w-full z-50 transition-all duration-300 bg-gray ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white/0'
//                 }`} >

//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-between h-16 lg:h-20">
//                         <div className="flex items-center space-x-2">
//                             <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
//                                 <FileText className="w-4 h-4 text-white" />
//                             </div>
//                             <span className="text-xl font-bold text-gray-900">Quick Invoice Generator </span>
//                         </div>
//                         <div className="hidden lg:flex lg!items-center lg:space-x-8">
//                             <a className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full" href="#features">Features</a>
//                             <a className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full" href="#testimonials">Testimonials</a>
//                             <a className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full" href="#faq">Faq</a>
//                         </div>
//                         <div className="hidden lg:flex items-center space-x-4">
//                             {isAuthenticated ? (<ProfileDropdown
//                                 isOpen={profileDropdownOpen}
//                                 onToggle={(e) => {
//                                     e.stopPropagation();
//                                     setProfileDropdownOpen(!profileDropdownOpen);
//                                 }}
//                                 avatar={user?.avatar || ""}
//                                 companyName={user?.name || ""}
//                                 email={user.email || ""}
//                                 onLogout={logout}
//                             />) : (<>
//                                 <Link className="text-black hover:text-gray-900 font-medium transition-colors duration-200" to="/login">Login</Link>
//                                 <Link
//                                     className="bg-gradient-to-r from-blue-900 to-blue-600 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
//                                     to="/signup"
//                                 >
//                                     Signup
//                                 </Link>
//                             </>

//                             )}
//                         </div>
//                         <div className="lg:hidden">
//                             <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors duration-200" onClick={() => setMenuOpen(!isMenuOpen)}>
//                                 {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {isMenuOpen && (
//                     <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow">
//                         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                             <a className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200" href="#features">Features</a>
//                             <a className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200" href="#testimonials">Testimonials</a>
//                             <a className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200" href="#faq">Faq</a>

//                         </div>
//                         <div className="border-t border-gray-200 my-2"></div>
//                         {
//                             isAuthenticated ? (
//                                 <div className="p-4">
//                                     <Button className="w-full" onClick={() => navigate('/dashboard')}>
//                                         Go to Dashboard
//                                     </Button>
//                                 </div>
//                             ) : (<>

//                                 <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                                     <Link to="/login"
//                                         className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200">
//                                         Login
//                                     </Link>
//                                     <Link to="/signup"
//                                         className="block w-full text-left bg-gray-900 hover:bg-gray-800 text-white px-4 py-3  rounded-lg font-medium transition-all duration-200">
//                                         Signup
//                                     </Link>
//                                 </div>
//                             </>)

//                         }
//                     </div>
//                 )}
//             </header>

//         </>
//     )
// }

// export default Header

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "../layout/ProfileDropdown";
import Button from "../ui/Button";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  console.log(user, isAuthenticated, logout)
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Quick Invoice Generator
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full transition-colors duration-200"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-gray-600 hover:text-gray-900 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full transition-colors duration-200"
            >
              FAQ
            </a>
          </div>

          {/* Right side (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.name || ""}
                companyName={user?.name || ""}
                email={user?.email || ""}
                onLogout={logout}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-black font-medium hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-900 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:scale-105 hover:shadow-lg transition-all duration-200"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors duration-200"
              onClick={() => setMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              FAQ
            </a>
          </div>

          <div className="border-t border-gray-200 my-2"></div>

          {isAuthenticated ? (
            <div className="p-4">
              <Button className="w-full" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/login"
                className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full text-left bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
