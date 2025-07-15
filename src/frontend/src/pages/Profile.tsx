import { useState, useEffect } from "react";
import { IdCard, Mail, User } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import TriggerDropdown from "../blocks/blocksHandler/triggers/Triggers"; // adjust the import path as needed

type UserData = {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    avatar_url: string;
  };
  app_metadata: {
    provider: string;
    providers: string[];
  };
};

interface ProfileProps {
  userData: UserData;
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const [isTriggerOpen, setIsTriggerOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState("workflow_123"); // Replace with actual dynamic ID if needed

 
  useEffect(() => {
    if (userData?.id) {
      localStorage.setItem("userId", userData.id);
    }
  }, [userData]);

  const handleSave = (data: any) => {
    console.log("Trigger Config Saved:", data);
    setIsTriggerOpen(false);
  };

  const handleCancel = () => {
    setIsTriggerOpen(false);
  };

  console.log("🧪 userData inside Profile:", userData);
  console.log("🧪 userId passed to TriggerDropdown:", userData.id);

  return (
    <div className="h-full pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={userData.user_metadata.avatar_url}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-t border-zinc-700">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Full Name</span>
                </div>
                <span>{userData.user_metadata.full_name}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Mail address</span>
                </div>
                <span>{userData.email}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  <span>ID</span>
                </div>
                <span>{userData.id}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span>Providers</span>
                <span className="flex gap-2 items-center">
                  {userData.app_metadata.providers.map((provider) => {
                    if (provider === "google") return <FaGoogle key="google" size={20} />;
                    if (provider === "github") return <FaGithub key="github" size={20} />;
                    return null;
                  })}
                </span>
              </div>
            </div>

            {/* 🔘 Trigger Config Button */}
            <div className="mt-6">
              <button
                onClick={() => setIsTriggerOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                Configure Trigger
              </button>
            </div>

            {/* 🧩 TriggerDropdown Modal or Inline UI */}
            <div className="mt-4">
              <TriggerDropdown
                isOpen={isTriggerOpen}
                onSave={handleSave}
                onCancel={handleCancel}
                appType="telegram" // or dynamically based on selected app
                userId={userData.id} // ✅ passed from profile
                workflowId={workflowId} // ✅ can be replaced with real one
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
