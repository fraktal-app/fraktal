import { Link, useNavigate } from "react-router-dom";
import { Home, Settings, User, LogOut, RefreshCcw } from "lucide-react";
import { signOutCurrentUser } from "../lib/userAuth"

const Sidebar = ({ collapsed }: { collapsed: boolean }) => {
     const navigate = useNavigate();
  return (
    <aside
      className={`hidden md:flex flex-col ${
        collapsed ? "w-20" : "w-64"
      } h-screen fixed top-0 left-0 bg-bar-dark text-white border-r border-gray-700 pt-16 transition-all duration-300`}
    >
      <nav className="flex flex-col gap-4 p-4 flex-1">
        <Link
            to="/dashboard/"
            className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg"
        >
            <Home className="w-6 h-6 shrink-0" />
            <span className={`transition-opacity duration-200 ${collapsed ? 'opacity-0 w-auto overflow-hidden' : 'opacity-100 w-auto'}`}>
                Home
            </span>
        </Link>

        <Link to="/dashboard/profile" className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-800 text-lg">
          <User className="w-6 h-6 shrink-0" />
           <span className={`transition-opacity duration-200 ${collapsed ? 'opacity-0 w-auto overflow-hidden' : 'opacity-100 w-auto'}`}>
                Profile
            </span>
        </Link>
        <Link to="/dashboard/notifications" className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-800 text-lg">
          <RefreshCcw  className="w-6 h-6 shrink-0" />
           <span className={`transition-opacity duration-200 ${collapsed ? 'opacity-0 w-auto overflow-hidden' : 'opacity-100 w-auto'}`}>
                Executions
            </span>
        </Link>
        <Link to="/dashboard/settings" className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-800 text-lg">
          <Settings className="w-6 h-6 shrink-0" />
           <span className={`transition-opacity duration-200 ${collapsed ? 'opacity-0 w-auto overflow-hidden' : 'opacity-100 w-auto'}`}>
                Settings
            </span>
        </Link>
        <button className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-800 text-lg mt-auto" onClick={() => signOutCurrentUser(navigate)}>
          <LogOut className="w-6 h-6 shrink-0" />
           <span className={`transition-opacity duration-200 ${collapsed ? 'opacity-0 w-auto overflow-hidden' : 'opacity-100 w-auto'}`}>
                Logout
            </span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
