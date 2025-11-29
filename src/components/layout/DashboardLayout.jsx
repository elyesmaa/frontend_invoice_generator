import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNavItem, setActiveItem] = useState("dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setMobile] = useState(window.innerWidth < 768);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const sidebarCollapsed = !isMobile && false;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setMobile(mobile);
      if (!mobile) setSideBarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (itemId) => {
    setActiveItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) setSideBarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeNavItem={activeNavItem}
        onNavigate={handleNavigation}
        isCollapsed={sidebarCollapsed}
        sideBarOpen={sideBarOpen}
        isMobile={isMobile}
        user={user}
        logout={logout}
      />

      {/* Overlay mobile */}
      {isMobile && sideBarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setSideBarOpen(false)}
        ></div>
      )}

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
      >
        <TopNavbar
          isMobile={isMobile}
          sideBarOpen={sideBarOpen}
          toggleSidebar={() => setSideBarOpen(!sideBarOpen)}
          user={user}
          profileDropdownOpen={profileDropdownOpen}
          setProfileDropdownOpen={setProfileDropdownOpen}
        />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
