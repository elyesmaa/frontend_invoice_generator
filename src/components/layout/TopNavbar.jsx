import { Menu, X } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const TopNavbar = ({ isMobile, sideBarOpen, toggleSidebar, user, profileDropdownOpen, setProfileDropdownOpen }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            {sideBarOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        )}
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Here’s your invoice overview.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <ProfileDropdown
          isOpen={profileDropdownOpen}
          onToggle={(e) => {
            e.stopPropagation();
            setProfileDropdownOpen(!profileDropdownOpen);
          }}
          avatar={user?.name || "U"}
          companyName={user?.businessName || ""}
          email={user?.email || ""}
          onLogout={user?.logout}
        />
      </div>
    </header>
  );
};

export default TopNavbar;
