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
import DashboardChromeSkeleton from "../components/DashboardChromeSkeleton";

function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true); // tracks loading state during session check
  const [userData, setUserData] = useState<any>(); // stores authenticated user info
  const [collapsed, setCollapsed] = useState(false); // controls sidebar collapse/expand
  const navigate = useNavigate();

  // Validate session and redirect if no user found
  async function manageUserSession() {
    const currentUserData = await getUserData();
    if (currentUserData) {
      setUserData(currentUserData);
      setIsLoading(false);
    } else {
      navigate('/login');
    }
  }

  // Run session check on initial render
  useEffect(() => {
    manageUserSession();
  }, []);

  // Debug log to verify loaded user data
  useEffect(() => {
    console.log("👤 Dashboard userData:", userData);
  }, [userData]);

  return (
    <div className="flex">
      {/* While loading, show skeleton UI for navbar/sidebar */}
      {isLoading ? (
        <DashboardChromeSkeleton />
      ) : (
        <>
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Sidebar collapsed={collapsed} />
        </>
      )}

      {/* Main content area adjusts width based on sidebar collapse state */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-0 md:ml-20" : "ml-0 md:ml-64"}`}>
        <main className="pt-16 p-4">
          <Routes>
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
