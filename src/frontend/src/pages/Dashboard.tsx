import { useEffect, useState } from "react"
import { getUserData, signOutCurrentUser } from "../lib/userAuth"
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>();
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
                <div>
                    <h1>ID: {userData.id}</h1>
                    <h1>Email: {userData.email}</h1>
                    <h1>Full Name: {userData.user_metadata.full_name}</h1>
                    <h1>
                        <img src={userData.user_metadata.avatar_url} />
                    </h1>
                    <h1>Providers: {userData.app_metadata.providers}</h1>
                </div>
            )
        }

        <div>
            <button onClick={() => signOutCurrentUser(navigate)}>
                Sign Out
            </button>
        </div>
    </div>
  )
}

export default Dashboard