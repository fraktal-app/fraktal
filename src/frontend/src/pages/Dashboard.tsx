//dashboard
import { useEffect, useState } from "react"
import { getUserData} from "../lib/userAuth"
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Home from "./Home";
import Settings from "./Settings";
import Executions from "./Executions";
import Profile from "./Profile";

function Dashboard() {
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  
  async function manageUserSession(){
    const currentUserData = await getUserData();

    if(currentUserData){
        setUserData(currentUserData);
        setIsLoading(false);
    }
    else{
        navigate('/login');
    }

  }  

  useEffect(() => {
    manageUserSession();
  }, [])

  return (
    <div>
        {isLoading ? 
            (<h1>Loading.....</h1>) :
            (


                 <div className="flex">
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Sidebar collapsed={collapsed} />
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
        
        <main className="pt-16 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="profile" element={<Profile userData={userData} />} />
            <Route path="executions" element={<Executions />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
            )
        }

    </div>
  )
}

export default Dashboard