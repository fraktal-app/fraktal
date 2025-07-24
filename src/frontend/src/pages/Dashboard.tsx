// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { getUserData } from "../lib/userAuth";
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Home from "./Home";
import Settings from "./Settings";
import Executions from "./Executions";
import Profile from "./Profile";
// Import the new, leaner skeleton component
import DashboardChromeSkeleton from "../components/DashboardChromeSkeleton";

function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  async function manageUserSession() {
    const currentUserData = await getUserData();
    if (currentUserData) {
      setUserData(currentUserData);
      setIsLoading(false);
    } else {
      navigate('/login');
    }
  }

  useEffect(() => {
    manageUserSession();
  }, []);

  useEffect(() => {
    console.log("👤 Dashboard userData:", userData);
  }, [userData]);

  // We no longer use a full-page loader. Instead, we render the layout
  // and conditionally show skeletons for the Navbar and Sidebar.
  return (
    <div className="flex">
      {isLoading ? (
        <DashboardChromeSkeleton />
      ) : (
        <>
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Sidebar collapsed={collapsed} />
        </>
      )}

      {/* The main content area is always rendered. */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"}`}>
        <main className="pt-16 p-4">
          <Routes>
            {/* The Home component will receive an undefined user_id while loading,
                which will trigger its own card skeletons. */}
            <Route path="/" element={<Home user_id={userData?.id} />} />
            <Route path="profile" element={userData ? <Profile userData={userData} /> : null} />
            <Route path="executions" element={<Executions />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;