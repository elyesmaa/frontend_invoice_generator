import { Link } from "react-router-dom";
import { FileText, LogOut } from "lucide-react";
import NavigationItem from "./NavigationItem";
import { NAV_LINKS } from "../../utils/data";
import CompanySwitcher from "./CompanySwitcher";




const Sidebar = ({ activeNavItem, onNavigate, isCollapsed, logout, sideBarOpen, isMobile }) => {
  // On mobile we toggle translation to slide the sidebar in/out
  const translateClass = isMobile ? (sideBarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0';
  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${translateClass} ${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200`}>

      {/* Logo */}
      <div className="flex items-center h-16 border-b border-gray-200 px-6 mb-4">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && <span className="text-gray-900 font-bold text-xl">Quick Invoice</span>}
        </Link>
      </div>

      <CompanySwitcher isCollapsed={isCollapsed} />

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {NAV_LINKS.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={activeNavItem === item.id}
            onClick={() => onNavigate(item.id)}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-4 right-4 mb-4">
        <button
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-100"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0 text-gray-500" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
