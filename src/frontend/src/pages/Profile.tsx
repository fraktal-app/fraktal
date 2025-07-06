import { Mail, User } from "lucide-react";

type UserData = {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    avatar_url: string;
  };
  app_metadata: {
    providers: string;
  };
};

interface ProfileProps {
  userData: UserData;
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
              src={userData.user_metadata.avatar_url}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4"
              />
            </div>
          </div>

         <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                  Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userData.user_metadata.full_name}</p>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userData.email}</p>
            </div>
          </div>
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>ID</span>
                <span>{userData.id}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Providers</span>
                <span className="text-green-500">{userData.app_metadata.providers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
